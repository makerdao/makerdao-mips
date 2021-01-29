import { Story, Meta } from '@storybook/angular/types-6-0';
import { MipDetailsComponent } from './mip-details.component';
import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { StatusComponent } from '../status/status.component';

export default {
  title: 'DEVELOP/Components/Mip Details',
  component: MipDetailsComponent,
  decorators: [
    moduleMetadata({
      declarations: [StatusComponent, MipDetailsComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<MipDetailsComponent> = (args: MipDetailsComponent) => ({
  component: MipDetailsComponent,
  props: args,
});

export const Default = Template.bind({});







