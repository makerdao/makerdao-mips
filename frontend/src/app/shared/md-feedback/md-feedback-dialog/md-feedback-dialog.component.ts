import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import { LangService } from 'src/app/services/lang/lang.service';

@Component({
  selector: 'app-md-feedback-dialog',
  templateUrl: './md-feedback-dialog.component.html',
  styleUrls: ['./md-feedback-dialog.component.scss'],
})
export class MdFeedbackDialogComponent implements OnInit {
  feedbackForm = this.fb.group({
    subject: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<MdFeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private langService: LangService,
    public darkModeService:DarkModeService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.langService.currentLang$.subscribe((language: string) => {
      this.translate.use(language);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  sendFeedback() {
    this.dialogRef.close(this.feedbackForm.value);
  }
}
