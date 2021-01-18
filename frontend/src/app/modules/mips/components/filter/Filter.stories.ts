import { Story, Meta } from '@storybook/angular/types-6-0';
import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { FilterComponent } from './filter.component';
import { StatusComponent } from '../status/status.component';

export default {
  title: 'DEVELOP/Components/Filter',
  component: FilterComponent,
  decorators: [
    moduleMetadata({
      declarations: [StatusComponent, FilterComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<FilterComponent> = (args: FilterComponent) => ({
  component: FilterComponent,
  props: args,
});

export const Default = Template.bind({});





