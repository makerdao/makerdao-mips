import { Story, Meta } from '@storybook/angular/types-6-0';
import { HeaderComponent } from './header.component';

export default {
  title: 'DEVELOP/Layout/Header',
  component: HeaderComponent,
} as Meta;

const Template: Story<HeaderComponent> = (args: HeaderComponent) => ({
  component: HeaderComponent,
  props: args,
});

export const Default = Template.bind({});





