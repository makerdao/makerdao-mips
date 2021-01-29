import { Story, Meta } from '@storybook/angular/types-6-0';
import { DetailContentComponent } from './detail-content.component';
import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { StatusComponent } from '../status/status.component';

export default {
  title: 'DEVELOP/Components/Mip Details Content',
  component: DetailContentComponent,
  decorators: [
    moduleMetadata({
      declarations: [StatusComponent, DetailContentComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<DetailContentComponent> = (args: DetailContentComponent) => ({
  component: DetailContentComponent,
  props: args,
});

export const Default = Template.bind({});







