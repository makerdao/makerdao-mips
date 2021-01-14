import { Story, Meta } from '@storybook/angular/types-6-0';
import { ListComponent } from './list.component';

export default {
  title: 'DEVELOP/Components/List',
  component: ListComponent,
} as Meta;

const Template: Story<ListComponent> = (args: ListComponent) => ({
  component: ListComponent,
  props: args,
});

export const Default = Template.bind({});





