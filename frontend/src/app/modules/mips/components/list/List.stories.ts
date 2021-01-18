import { Story, Meta } from '@storybook/angular/types-6-0';
import { ListComponent } from './list.component';
import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { StatusComponent } from '../status/status.component';
import { SocialComponent } from '../social/social.component';
import { MatTableModule } from '@angular/material/table';

export default {
  title: 'DEVELOP/Components/List',
  component: ListComponent,
  decorators: [
    moduleMetadata({
      declarations: [StatusComponent, ListComponent, SocialComponent],
      imports: [CommonModule, MatTableModule],
    }),
  ],
} as Meta;

const Template: Story<ListComponent> = (args: ListComponent) => ({
  component: ListComponent,
  props: args,
});

export const Default = Template.bind({});





