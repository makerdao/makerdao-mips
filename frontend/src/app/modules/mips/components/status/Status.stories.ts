import { Story, Meta } from '@storybook/angular/types-6-0';
import { StatusComponent } from './status.component';

export default {
  title: 'DEVELOP/Components/Status',
  component: StatusComponent,
} as Meta;

const Template: Story<StatusComponent> = (args: StatusComponent) => ({
  component: StatusComponent,
  props: args,
});

export const Accepted = Template.bind({});
Accepted.args = {
  type: 'ACCEPTED',
};

export const Rejected = Template.bind({});
Rejected.args = {
  type: 'REJECTED',
};

export const Archive = Template.bind({});
Archive.args = {
  type: 'ARCHIVE',
};

export const Rfc = Template.bind({});
Rfc.args = {
  type: 'RFC',
};
