import { Story, Meta } from '@storybook/angular/types-6-0';
import { PullRequestHistoryComponent } from './pull-request-history.component';
import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { StatusComponent } from '../status/status.component';

export default {
  title: 'DEVELOP/Components/Pull Request History',
  component: PullRequestHistoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [StatusComponent, PullRequestHistoryComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<PullRequestHistoryComponent> = (args: PullRequestHistoryComponent) => ({
  component: PullRequestHistoryComponent,
  props: args,
});

export const Default = Template.bind({});







