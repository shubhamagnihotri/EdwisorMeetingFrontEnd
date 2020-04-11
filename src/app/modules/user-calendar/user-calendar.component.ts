import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  Inject,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Router,ActivatedRoute} from '@angular/router'

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MeetingService} from "../../services/meeting.service";
import {MatSnackBar} from '@angular/material/snack-bar';
export interface DialogData {
  meetingTitle: string;
  meetingDate: string;
  meetingStartTimeHour:string;
  meetingStartTimeSecond: string;
  meetingStartTimeFrame: string;
  metingEndTimeHour:string;
  metingEndTimeSecond:string,

  meetingEndTimeFrame: string;
  meetingDescription:string;
  meetingLocation:string,
}

import { AuthService} from "../../services/auth.service";
import { MeetingSocketService } from "../../services/meeting-socket.service"
@Component({
  selector: 'app-user-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-calendar.component.html',
  styleUrls: ['./user-calendar.component.css'],
  providers:[MeetingSocketService]
})
export class UserCalendarComponent implements OnInit,OnDestroy,AfterViewInit {
  userDetails={
    role: "",
    countryCode: "",
    mobileNumber: "",
    email: "",
    lastName: "",
    firstName: "",
    userId: "",
    _token:""
  };
  public innerWidth: any;
  userId:string;
  meetingTitle: string;
  meetingDate: string;
  meetingStartTimeHour:string;
  meetingStartTimeSecond: string;
  meetingStartTimeFrame: string;
  metingEndTimeHour:string;
  metingEndTimeSecond:string;
  meetingEndTimeFrame: string;
  meetingDescription:string;
  meetingLocation:string;
  disconnectedSocket = false;
  @ViewChild('modalContent', { read: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  meetingSnooze:any;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  public showEvent ={
    label: '<i class="material-icons">remove_red_eye</i>',
    a11yLabel: 'Delete',
    onClick: ({ event }: { event: any }): void => {
      if(event){
        this.getEditMeetingDetail(event.meetingId,'yes')
      }
      // this.events = this.events.filter((iEvent) => iEvent !== event);
      // this.handleEvent('Deleted', event);
    },
  }
  actions: CalendarEventAction[] = [
    
    {
      label: '<i class="material-icons">edit</i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: any }): void => {
        if(event){
            this.activeDayIsOpen =false;
            this.getEditMeetingDetail(event.meetingId)
        }
        //this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="material-icons">delete</i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: any }): void => {
        if(event){
          // console.log(event);
          this.activeDayIsOpen =false;
          this.deleteMeetingDetail(event.meetingId,event.title)
        }
        // this.events = this.events.filter((iEvent) => iEvent !== event);
        // this.handleEvent('Deleted', event);
      },
    },
    this.showEvent
    ];


  refresh: Subject<any> = new Subject();

  events: any[] = [];

  activeDayIsOpen: boolean = false;
  constructor(private modal: NgbModal,public dialog: MatDialog,public meeting:MeetingService,public activateRoute:ActivatedRoute,private _snackBar: MatSnackBar,public auth:AuthService,public route:Router,public meetingSocket:MeetingSocketService) { }

  ngOnInit() {
    let userDetails= this.auth.getFromLocalStore('userDetails');
    this.userDetails = userDetails;
   
    this.userId = this.activateRoute.snapshot.paramMap.get('userId');
    this.verifyUserFromSocket();
    this.getOnlineUserList();
    this.getAllUserMeeting();
   
   }
   ngAfterViewInit(){
    this.innerWidth = window.innerWidth;
    console.log( this.innerWidth)
    this.socketMeetingUpdate();
    this.checkAndgetSnoozeMeeting()
    
   }

   checkAndgetSnoozeMeeting(){
    if(this.userDetails.role == 'user'){
      this.getSnoozedMeetingDetail();
    }
   }
   verifyUserFromSocket(){
    //  console.log('socket');
     this.meetingSocket.verifyUser().subscribe((data)=>{
       
      //this.disconnectedSocket = false;
      this.meetingSocket.setUser(this.userDetails._token);
   
      this.socketVerificationFaild()
     })
   }

   socketMeetingUpdate(){
    this.meetingSocket.getMeetingUpdatedSocket(this.userDetails.userId).subscribe(data=>{
      let flshMsg='';
      if(data.meetingFlag == 'create'){
       flshMsg =`One New Meeing Created with this tile : ${data.meetingTitle}`
      }
      if(data.meetingFlag == 'update'){
       flshMsg =`One Meeing update with this tile : ${data.meetingTitle}`
      }
      if(data.meetingFlag == 'delete'){
       flshMsg =`One Meeing deleted with this tile : ${data.meetingTitle}`
      }

      this.openSnackBar(flshMsg,'success');
      this.events =[];
      setTimeout(()=>{
        this.getAllUserMeeting();
        this.refresh.next();
        // this.checkAndgetSnoozeMeeting();
      },1000)
      setTimeout(()=>{
        this.checkAndgetSnoozeMeeting();
      },3000)
     
    })
   }

   getSnoozedMeetingDetail(){
     this.meeting.getSnooozedTime(this.userId,this.userDetails._token).subscribe((data)=>{
        if(data.error == false && (data.data != null || undefined)  ){
            this.checkSnoozeData(data.data);
        }
     })
   }

   checkSnoozeData(data){
      let t=setTimeout(()=>{
        if(confirm(data.meetingTitle+' is ready press ok if you want to dissmiss snooze and cancel if you want to snoozse after 5 second')){
          this.stopeSnooze(data,'after5Minu')
        }else{
          this.stopeSnooze(data,'dissmiss')
        }
      },data.snoozeTime)
      this.meetingSnooze = t;
   }

   stopeSnooze(data,actionFlag){
    if(actionFlag == 'dissmiss'){
      data.snoozeTime = 5000;
      clearTimeout(this.meetingSnooze);
      console.log(data)
      this.checkSnoozeData(data);
    }else{
      console.log("yes");
      console.log(data);
      this.meeting.updateSnoozeOnMeeting(data.meetingId,this.userDetails._token).subscribe((res)=>{
        if(res.error = false){
          this.getSnoozedMeetingDetail();
        }
      }) 
      clearTimeout(this.meetingSnooze);
    }
   }
   
   getOnlineUserList(){
    // console.log('onlineuser');
     this.meetingSocket.getOnlineUserList().subscribe((userList)=>{
       console.log(userList);
      //  console.log('online-userList');
     })
   }

   socketVerificationFaild(){
    this.meetingSocket.authError().subscribe((socketRes)=>{
      console.log(socketRes);
      // console.log('auth error');
    })
   }

  openSnackBar(message: string, action: string,duration?) {
    let background="";
    if(action == 'success'){
      background = 'green-snackbar';
    }
    if(action == 'failed'){
      background = 'red-snackbar';
    }
    this._snackBar.open(message, action, {
      duration: duration || 2000,
      panelClass: [background]
    });
  }
  checkAllMeeting(){
    this.route.navigate(['dashboard/view-user-all-meeting',this.userId]);
  }

  getEditMeetingDetail(meetingId,show?){
    // alert(meetingId);
    this.meeting.getAllMeeting(this.userId,meetingId,this.userDetails._token).subscribe((res)=>{
      if(res.error){
        this.openSnackBar(res.message,'failed');
      }else if(res.error == false && res.status == 200){
        // console.log(res);
        let date = new Date(res.data.meetingDate);
        delete res.data.meetingUserId;
        delete res.data.updatedAt;
        delete res.data.createdAt;
        if(show && show =='yes'){
          res.data.show = true;
        }
        this.openDialog(date,meetingId,res.data)
        this.refresh.next();
        this.openSnackBar(res.message,'success');
      }else{
        this.openSnackBar(`unkown error`,'failed')
      }
    },(error)=>{
      this.openSnackBar(error,'failed');
    })
  }

  getAllUserMeeting(){
    this.meeting.getAllMeeting(this.userId,null,this.userDetails._token).subscribe((res)=>{
    
      if(res.error){
        this.openSnackBar(res.message,'failed');
      }else if(res.error == false && res.status == 200){
        res.data.forEach(element => {
          let eventObj = {start:new Date(element.meetingDate),end:new Date(element.meetingDate),title:element.meetingTitle.toUpperCase(),color:colors.red,actions:[],meetingId:element.meetingId};
          this.userDetails.role == 'admin'? eventObj.actions= this.actions:eventObj.actions =[this.showEvent];
          this.events.push(eventObj)
         
        });
     
       this.refresh.next()
        this.openSnackBar(res.message,'success');
      }else{
        this.openSnackBar(`unkown error`,'failed')
      }
    },(error)=>{
      this.openSnackBar(error,'failed');
    });
  }
  
  openDialog(selectedDate,meetingId?,data?): void {
    //this.meetingDate= (selectedDate.getMonth()+1)+'/'+selectedDate.getDate()+'/'+selectedDate.getFullYear();
    this.meetingDate= selectedDate;

    if(!data){
      data ={meetingTitle: this.meetingTitle, meetingDate: this.meetingDate,meetingStartTimeHour:this.meetingStartTimeHour,
        meetingStartTimeSecond:this.meetingStartTimeSecond,meetingStartTimeFrame:this.meetingStartTimeFrame,
        metingEndTimeHour:this.metingEndTimeHour,metingEndTimeSecond:this.metingEndTimeSecond,
        meetingEndTimeFrame:this.meetingEndTimeFrame,
        meetingDescription:this.meetingDescription,meetingLocation:this.meetingLocation,show:false}
    }
    // if(show){

    // }
 
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: this.innerWidth <= 768? '80%':'50%',
      data: data
       
    });

    dialogRef.afterClosed().subscribe(result => {
      //alert('The dialog was closed');
        if(result){
          if(meetingId){
            //update meeting
            this.activeDayIsOpen = false;
            this.callUpdateMeeting(meetingId,result)
           
          }else{
            this.callCreateMeeting(result);
            //for new create Meeting
          }
        
        }
          // console.log(result);     
        console.log('The dialog was closed')
    });
  }


  callCreateMeeting(result){
      this.meeting.createMeeting(result,this.userId,this.userDetails._token).subscribe((data)=>{
        // console.log(data);
        if(data.error){
          this.openSnackBar(data.message,'failed');
        }else if(data.error == false && data.status == 200){
          let element = data.data
          let eventObj = {start:new Date(element.meetingDate),end:new Date(element.meetingDate),title:element.meetingTitle.toUpperCase(),color:colors.red,actions:[],meetingId:element.meetingId};
          this.userDetails.role == 'admin'? eventObj.actions= this.actions:eventObj.actions =[this.showEvent];
          this.events.push(eventObj)
          this.refresh.next();
          this.openSnackBar(data.message,'success');
          this.meetingSocket.meetingUpdatedSocket({meetingFlag:'create',meetingTitle:element.meetingTitle.toUpperCase(),userId:this.userId})
        }else{
          this.openSnackBar(`unkown error`,'failed')
        }
      },(error)=>{
        this.openSnackBar(error,'failed');
      })
  }

  callUpdateMeeting(meetingId,result){
   
    this.meeting.callUpdateMeeting(meetingId,result,this.userDetails._token).subscribe((data)=>{
      // console.log(data);
      if(data.error){
        this.openSnackBar(data.message,'failed');
      }else if(data.error == false && data.status == 200){
        this.events = this.events.filter((currentValue,index,arr)=> {
         return currentValue.meetingId != meetingId;
        })
        let eventObj = {start:new Date(result.meetingDate),end:new Date(result.meetingDate),title:result.meetingTitle.toUpperCase(),color:colors.red,actions:[],meetingId:result.meetingId};
        this.userDetails.role == 'admin'? eventObj.actions= this.actions:eventObj.actions =[this.showEvent];
       
        this.events.push(eventObj)
        this.refresh.next();
        this.openSnackBar(data.message,'success');
        this.meetingSocket.meetingUpdatedSocket({meetingFlag:'update',meetingTitle:result.meetingTitle.toUpperCase(),userId:this.userId})
      }else{
        this.openSnackBar(`unkown error`,'failed')
      }
    },(error)=>{
      this.openSnackBar(error,'failed');
    })
  }//

  
  deleteMeetingDetail(meetingId,meetingTitle){
    this.activeDayIsOpen = false;
    this.meeting.deleteMeeting(meetingId,this.userId,this.userDetails._token).subscribe((res)=>{
      // console.log(res);
      if(res.error){
        this.openSnackBar(res.message,'failed');
      }else if(res.error == false && res.status == 200){
        this.openSnackBar('Meeting Deleted successfully','success');
        this.events = this.events.filter((currentValue,index,arr)=> {
          return currentValue.meetingId != meetingId;
         })
       
      
        this.meetingSocket.meetingUpdatedSocket({meetingFlag:'delete',meetingTitle:meetingTitle.toUpperCase(),userId:this.userId})
        this.refresh.next();
      }else{
        this.openSnackBar(`unkown error`,'failed')
      }
    },(error)=>{
      this.openSnackBar(error,'failed');
    })
  }


  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
   
    if(events.length == 0 && this.userDetails.role == "admin"){
      // console.log(this.refresh);
      this.openDialog(date);
      
    }
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
         //this.openDialog();
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }
  
  setView(view: CalendarView) {
    this.view = view;
  }
  
  closeOpenMonthViewDay() {
    console.log(this.viewDate.getFullYear());
    if(this.viewDate.getFullYear() != new Date().getFullYear()){
      this.viewDate = new Date();
      this.openSnackBar(`Only Allow for the current year`,'failed')
      return false;
    }
    this.activeDayIsOpen = false;
  }
  changeMeetingEndTime(data){
    console.log(data);
  }

  ngOnDestroy(){
      this.meetingSocket.exitSocket();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  hours =[];
  minutes =[]
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.createHour();
      // this.changeMeetingEndTime(null)
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createHour(){
    for(let i=1;i<=12;i++){
      this.hours.push(i);
    }
    for(let i=0;i<=59;i++){
      this.minutes.push(i);
    }
  }
  // changeMeetingEndTime(data){
  //   console.log(data);
  // }
}