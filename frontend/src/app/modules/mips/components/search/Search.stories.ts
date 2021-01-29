import { Story, Meta } from '@storybook/angular/types-6-0';
import { SearchComponent } from './search.component';

export default {
  title: 'DEVELOP/Components/Search',
  component: SearchComponent,
} as Meta;

const Template: Story<SearchComponent> = (args: SearchComponent) => ({
  component: SearchComponent,
  props: args,
});

export const Default = Template.bind({});


export const Custom = Template.bind({});
Custom.args = {
  placeHolder: 'Custom placeholder',
  imageDir: '../../../../../assets/images/social_forum.svg'
};


