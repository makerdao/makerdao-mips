import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MipsService } from '../../services/mips.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
showContainer = false;
@ViewChild('input') input: ElementRef;
@ViewChild('textarea') textarea: ElementRef;
disabled = true;
sent = false;

  constructor(
    private mipsService: MipsService
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
   this.showContainer = false;
 }

 sendFeedback(): void {
   this.disabled = true;
   this.mipsService.sendFeedBack(this.input.nativeElement.value, this.textarea.nativeElement.value)
   .subscribe(() => {
      this.input.nativeElement.value = '';
      this.textarea.nativeElement.value = '';
      this.sent = true;
      this.showContainer = false;
      setTimeout(() => {
        this.sent = false;
      }, 3000);
    });
 }

 onKey(): void {
  this.disabled = this.input.nativeElement.value === '' ||
  this.textarea.nativeElement.value === '' ? true : false;
 }

}
