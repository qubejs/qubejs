// import Form from '../../components/Form';
// import Progress from '../../components/Progress';
// import LaunchTimer from '../../components/LaunchTimer';
// import Wrapper from '../../components/Wrapper';
// import Iframe from '../../components/Iframe';
// import ImageWithSpotlight from '../../components/ImageWithSpotlight';
// import TextColumnWithLinks from '../../components/TextColumnWithLinks';
import { ItemTypes } from './ItemTypes';
import HeaderEdit from './edits/Header';
import HeroContentEdit from './edits/HeroContent';
import IframeEdit from './edits/Iframe';
import LaunchTimerEdit from './edits/LaunchTimer';
import CodeHighlightEdit from './edits/CodeHighlight';
import PricingEdit from './edits/Pricing';
import ContactUsInfoEdit from './edits/ContactUsInfo';
import ImageWithSpotlightEdit from './edits/ImageWithSpotlight';
import ImageBlockWithTextEdit from './edits/ImageBlockWithText';
import ImageWithHeaderBodyEdit from './edits/ImageWithHeaderBody';
import TeamEdit from './edits/Team';
import ImageWithSlideEdit from './edits/ImageWithSlide';
import UsefulLinksEdit from './edits/UsefulLinks';
import DisclaimerEdit from './edits/Disclaimer';
import FeaturedContentEdit from './edits/FeaturedContent';
import TextColumnWithLinksEdit from './edits/TextColumnWithLinks';
import GetInTouchEdit from './edits/GetInTouch';
import RichTextEdit from './edits/RichText';
import InputEdit from './edits/Input';
import ReCaptchaEdit from './edits/ReCaptcha';
import SelectEdit from './edits/Select';
import RadioEdit from './edits/Radio';
import FormEdit from './edits/Form';
import CheckboxEdit from './edits/CheckboxField';
import CheckboxListEdit from './edits/CheckboxList';
import WrapperEdit from './edits/Wrapper';
import ButtonEdit from './edits/Button';
import TextEdit from './edits/Text';
import TabsEdit from './edits/Tabs';
import TextareaEdit from './edits/Textarea';
import ProgressEdit from './edits/Progress';
import CustomEdit from './edits/Custom';
import HTMLEdit from './edits/HTML';
import ImageEdit from './edits/Image';
import DateSelectorEdit from './edits/DateSelector';
import AutocompleteEdit from './edits/Autocomplete';
import AlertEdit from './edits/Alert';
import { GLOBAL_OPTIONS } from '../../globals';
import { dynamicComponents } from '../../utils/storage';
// import Input from '../../components/Input';
// import RichText from '../../components/RichText';
// import Text from '../../components/Text';
// import Header from '../../components/Header';
// import Tabs from '../../components/Tabs';
// import DateSelector from '../../components/DateSelector';
// import Image from '../../components/Image';
// import Button from '../../components/Button';
// import Link from '../../components/Link';
// import LinkButton from '../../components/LinkButton';
// import Textarea from '../../components/Textarea';
// import Radio from '../../components/Radio';
// import ReCaptcha from '../../components/ReCaptcha';
// import Select from '../../components/Select';
// import Autocomplete from '../../components/Autocomplete';
// import CheckboxField from '../../components/Checkbox';
// import Alert from '../../components/Alert';
// import CheckboxList from '../../components/CheckboxList';
// import HeroContent from '../../components/HeroContent';
// import Pricing from '../../components/Pricing';
// import ImageWithSlide from '../../components/ImageWithSlide';
// import UsefulLinks from '../../components/UsefulLinks';
// import Disclaimer from '../../components/Disclaimer';
// import FeaturedContent from '../../components/FeaturedContent';
// import ContactUsInfo from '../../components/ContactUsInfo';
// import GetInTouch from '../../components/GetInTouch';
// import CodeHighlight from '../../components/CodeHighlight';
// import Team from '../../components/Team';
// import ImageBlockWithText from '../../components/ImageBlockWithText';
// import ImageWithHeaderBody from '../../components/ImageWithHeaderBody';
// import HTML from '../../components/HTML';

const compList = {
  Form: {
    Component: 'Form',
    group: 'Form',
    hasPlaceholder: true,
    type: ItemTypes.FORM,
    defaultComp: 'Input',
    itemsPropName: 'fields',
    accept: [ItemTypes.FORM_ELEMENT, ItemTypes.FORM],
    compTypeProp: 'cmpType',
    hasItems: true,
    editData: FormEdit,
    sampleData: {},
  },

  Address: {
    Component: 'Form',
    name: 'Form',
    group: 'Pre-defined Elements',
    hasPlaceholder: true,
    type: ItemTypes.FORM,
    itemsPropName: 'fields',
    accept: [ItemTypes.FORM_ELEMENT, ItemTypes.FORM],
    compTypeProp: 'cmpType',
    hasItems: false,
    editData: FormEdit,
    sampleData: {
      className: 'sq-form--2-cols',
      fields: [
        {
          cmpType: 'Input',
          label: 'Address Line 1',
          name: 'addressLine1',
        },
        {
          cmpType: 'Input',
          label: 'Address Line 2',
          name: 'addressLine2',
        },
        {
          cmpType: 'Input',
          label: 'City',
          name: 'city',
        },
        {
          cmpType: 'Input',
          label: 'State',
          name: 'state',
        },
        {
          cmpType: 'Input',
          label: 'Postal Code',
          name: 'postalCode',
        },
      ],
    },
  },
  Name: {
    Component: 'Form',
    name: 'Form',
    group: 'Pre-defined Elements',
    hasPlaceholder: true,
    type: ItemTypes.FORM,
    itemsPropName: 'fields',
    accept: [ItemTypes.FORM_ELEMENT, ItemTypes.FORM],
    compTypeProp: 'cmpType',
    hasItems: false,
    editData: FormEdit,
    sampleData: {
      className: 'sq-form--3-cols',
      fields: [
        {
          cmpType: 'Select',
          label: 'Salutation',
          name: 'salutation',
          options: GLOBAL_OPTIONS.salutation.toArray(),
        },
        {
          cmpType: 'Input',
          label: 'First Name',
          name: 'firstName',
        },
        {
          cmpType: 'Input',
          label: 'Last Name',
          name: 'lastName',
        },
      ],
    },
  },
  Input: {
    Component: 'Input',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: InputEdit,
    sampleData: {
      label: 'Label',
    },
  },
  RichText: {
    Component: 'RichText',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: RichTextEdit,
    sampleData: {
      label: 'Rich Label',
    },
  },
  Text: {
    Component: 'Text',
    group: 'Content',
    type: ItemTypes.COMPONENT,
    editData: TextEdit,
    sampleData: {
      text: 'text goes here',
    },
  },
  LaunchTimer: {
    Component: 'LaunchTimer',
    group: 'Content',
    sampleData: {},
    type: ItemTypes.COMPONENT,
    editData: LaunchTimerEdit,
  },
  FormText: {
    Component: 'Text',
    name: 'Text',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: TextEdit,
    sampleData: {
      text: 'text goes here',
    },
  },
  FormHeader: {
    Component: 'Header',
    name: 'Header',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: TextEdit,
    sampleData: {
      text: 'text goes here',
      tag: 'h1',
    },
  },
  Tabs: {
    Component: 'Tabs',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: TabsEdit,
    sampleData: {},
  },
  DateSelector: {
    Component: 'DateSelector',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: DateSelectorEdit,
    sampleData: {
      inputFormat: 'yyyy/MM/dd',
      outputFormat: 'YYYY/MM/DD',
      mask: '____/__/__',
    },
  },
  Progress: {
    Component: 'Progress',
    group: 'Content',
    type: ItemTypes.COMPONENT,
    editData: ProgressEdit,
    sampleData: {
      className: 'tp-progress--active',
      overlay: true,
    },
  },
  Header: {
    Component: 'Header',
    group: 'Content',
    sampleData: {
      header: 'Header',
      subHeader: 'Sub header',
    },
    editData: HeaderEdit,
  },
  Image: {
    Component: 'Image',
    group: 'Content',
    type: ItemTypes.COMPONENT,
    editData: ImageEdit,
    sampleData: {},
  },
  Button: {
    Component: 'Button',
    group: 'Actions',
    type: ItemTypes.COMPONENT,
    editData: ButtonEdit,
    sampleData: {
      buttonText: 'Action',
    },
  },
  Link: {
    Component: 'Link',
    group: 'Actions',
    type: ItemTypes.COMPONENT,
    editData: ButtonEdit,
    sampleData: {
      buttonText: 'Action',
    },
  },
  LinkButton: {
    Component: 'LinkButton',
    group: 'Actions',
    type: ItemTypes.COMPONENT,
    editData: ButtonEdit,
    sampleData: {
      buttonText: 'Action',
    },
  },
  Textarea: {
    Component: 'Textarea',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: TextareaEdit,
    sampleData: {
      label: 'Label',
      minRows: 3,
    },
  },
  Radio: {
    Component: 'Radio',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: RadioEdit,
    sampleData: {
      label: 'Radio Label',
    },
  },
  ReCaptcha: {
    Component: 'ReCaptcha',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: ReCaptchaEdit,
    sampleData: {},
  },
  Select: {
    Component: 'Select',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: SelectEdit,
    sampleData: {
      label: 'Select',
    },
  },
  Autocomplete: {
    Component: 'Autocomplete',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: AutocompleteEdit,
    sampleData: {
      label: 'Autocomplete',
    },
  },
  CheckboxField: {
    Component: 'CheckboxField',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: CheckboxEdit,
    sampleData: {
      label: 'Label',
    },
  },
  AlertElement: {
    Component: 'Alert',
    name: 'Alert',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: AlertEdit,
    sampleData: {
      message: 'Sample message',
    },
  },
  Alert: {
    Component: 'Alert',
    group: 'Content',
    type: ItemTypes.COMPONENT,
    editData: AlertEdit,
    sampleData: {
      message: 'Sample message',
    },
  },
  CheckboxList: {
    Component: 'CheckboxList',
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: CheckboxListEdit,
    sampleData: {
      label: 'Label',
    },
  },
  Wrapper: {
    Component: 'Wrapper',
    group: 'Layout',
    accept: [ItemTypes.COMPONENT, ItemTypes.FORM],
    hasPlaceholder: true,
    compTypeProp: 'component',
    editData: WrapperEdit,
    itemsPropName: 'items',
    hasItems: true,
    sampleData: {
      bodyClassName: 'row',
    },
  },
  'Center-Layout': {
    Component: 'Wrapper',
    name: 'Wrapper',
    group: 'Layout',
    accept: [ItemTypes.COMPONENT, ItemTypes.FORM],
    hasPlaceholder: true,
    compTypeProp: 'component',
    editData: WrapperEdit,
    itemsPropName: 'items',
    hasItems: true,
    sampleData: {
      bodyClassName: 'text-center',
      bodyContainerClassName: '',
    },
  },
  '2-ColumnLayout': {
    Component: 'Wrapper',
    name: 'Wrapper',
    group: 'Layout',
    accept: [ItemTypes.COMPONENT, ItemTypes.FORM],
    hasPlaceholder: true,
    compTypeProp: 'component',
    editData: WrapperEdit,
    itemsPropName: 'items',
    hasItems: true,
    sampleData: {
      className: '',
      bodyClassName: 'row',
      items: [
        {
          component: 'Wrapper',
          name: 'wrapper1',
          className: 'col-xs-12 col-md-6',
          bodyContainerClassName: '',
          bodyClassName: '',
        },
        {
          component: 'Wrapper',
          bodyContainerClassName: '',
          name: 'wrapper2',
          bodyClassName: '',
          className: 'col-xs-12 col-md-6',
        },
      ],
    },
  },
  '3-ColumnLayout': {
    Component: 'Wrapper',
    name: 'Wrapper',
    group: 'Layout',
    accept: [ItemTypes.COMPONENT, ItemTypes.FORM],
    hasPlaceholder: true,
    compTypeProp: 'component',
    editData: WrapperEdit,
    itemsPropName: 'items',
    hasItems: true,
    sampleData: {
      className: '',
      bodyClassName: 'row',
      items: [
        {
          component: 'Wrapper',
          name: 'wrapper1',
          className: 'col-xs-12 col-md-4',
          bodyContainerClassName: '',
          bodyClassName: '',
        },
        {
          component: 'Wrapper',
          bodyContainerClassName: '',
          name: 'wrapper2',
          bodyClassName: '',
          className: 'col-xs-12 col-md-4',
        },
        {
          component: 'Wrapper',
          bodyContainerClassName: '',
          name: 'wrapper3',
          bodyClassName: '',
          className: 'col-xs-12 col-md-4',
        },
      ],
    },
  },
 
  Custom: {
    group: 'Content',
    type: ItemTypes.FORM,
    editData: CustomEdit,
    sampleData: {
      component: 'Custom',
    },
  },
  CustomElement: {
    group: 'Form Elements',
    type: ItemTypes.FORM_ELEMENT,
    editData: CustomEdit,
    sampleData: {
      cmpType: 'CustomElement',
    },
  },
  HeroContent: {
    group: 'Content',
    Component: 'HeroContent',
    sampleData: {
      header: 'Awesome header content',
      subHeader: 'Reprehenderit laborum in ut enim Lorem minim ea ex dolore eiusmod id consequat pariatur amet. Id Lorem id et elit.',
    },
    editData: HeroContentEdit,
  },
  Pricing: {
    group: 'Content',
    Component: 'Pricing',
    sampleData: {
      header: 'Pricing Plan',
      subHeader: 'Choose your own plan',
      features: [
        {
          icon: 'person',
          text: 'Users',
        },
        {
          icon: 'Computer',
          text: 'Websites ',
        },
        {
          icon: 'CheckCircleOutline',
          text: 'Dynamic Editing',
        },
        {
          icon: 'Cloud',
          text: 'Taken changes',
        },
        {
          icon: 'Donwload',
          text: 'Future updates',
        },
        {
          icon: 'CheckCircleOutline',
          text: 'Parking',
        },
      ],

      items: [
        {
          header: 'Basic',
          price: 'USD $25',
          icon: 'calendar',
          lastPrice: 'USD $49',
          color: 'primary',
          features: [
            {
              icon: 'CheckCircleOutline',
              text: 'Ut pariatur',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'aliqua commodo elit mollit ullamco. ',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'Eiusmod ut dolor reprehenderit reprehenderit',
            },
            {
              icon: 'CheckCircleOutline',
              text: ' tempor mollit et deserunt labore. Occaecat ',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'elit ea consectetur minim do officia',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'qui cillum minim veniam ea nostrud irure sit',
            },
          ],
          actions: [
            {
              buttonText: 'Contact us',
              type: 'Button',
              variant: 'outlined',
            },
          ],
        },
        {
          header: 'Professional',
          price: 'USD $50',
          icon: 'calendar',
          color: 'success',
          features: [
            {
              icon: 'CheckCircleOutline',
              text: 'Ut pariatur',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'aliqua commodo elit mollit ullamco. ',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'Eiusmod ut dolor reprehenderit reprehenderit',
            },
            {
              icon: 'CheckCircleOutline',
              text: ' tempor mollit et deserunt labore. Occaecat ',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'elit ea consectetur minim do officia',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'qui cillum minim veniam ea nostrud irure sit',
            },
          ],
          actions: [
            {
              buttonText: 'Contact us',
              type: 'Button',
              variant: 'outlined',
            },
          ],
        },
        {
          header: 'Enterprise',
          price: 'USD $599',
          color: 'info',
          icon: 'calendar',
          features: [
            {
              icon: 'CheckCircleOutline',
              text: 'Ut pariatur',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'aliqua commodo elit mollit ullamco. ',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'Eiusmod ut dolor reprehenderit reprehenderit',
            },
            {
              icon: 'CheckCircleOutline',
              text: ' tempor mollit et deserunt labore. Occaecat ',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'elit ea consectetur minim do officia',
            },
            {
              icon: 'CheckCircleOutline',
              text: 'qui cillum minim veniam ea nostrud irure sit',
            },
          ],
          actions: [
            {
              buttonText: 'Contact us',
              type: 'Button',
              variant: 'outlined',
            },
          ],
        },
      ],
    },
    editData: PricingEdit,
  },
  ImageWithSlide: {
    group: 'Content',
    Component: 'ImageWithSlide',
    sampleData: {
      eyebrow: 'eybrow',
      header: 'Header',
      image: {
        src: 'https://st.depositphotos.com/2309453/3447/i/600/depositphotos_34479387-stock-photo-group-of-young-business-people.jpg',
      },
    },
    editData: ImageWithSlideEdit,
  },
  UsefulLinks: {
    group: 'Content',
    Component: 'UsefulLinks',
    sampleData: {
      header: 'Header goes here',
      links: [
        {
          iconName: 'star',
          text: 'Learn more about',
          to: '/content/new',
        },
      ],
    },
    editData: UsefulLinksEdit,
  },
  Disclaimer: {
    group: 'Content',
    Component: 'Disclaimer',
    sampleData: {
      text: 'Reprehenderit minim non id dolor fugiat amet. Esse ea aliquip eu ex duis id et reprehenderit sint non elit cillum fugiat. Quis cupidatat adipisicing magna tempor occaecat minim. Culpa duis deserunt laboris ad voluptate laboris est laboris duis nostrud. Mollit incididunt esse Lorem pariatur dolor nulla ea aute sit sunt occaecat.',
    },
    editData: DisclaimerEdit,
  },
  FeaturedContent: {
    group: 'Content',
    Component: 'FeaturedContent',
    sampleData: {
      className: 'text-center',
      items: [
        {
          icon: 'call',
          title: 'ALL BRANDS',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices dui sapien eget mi proin sed. Eget nulla facilisi etiam dignissim diam. Eu nisl nunc mi ipsum faucibus. Risus sed vulputate odio ut. Orci a scelerisque purus semper eget duis. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Ut faucibus pulvinar',
        },
        {
          icon: 'message',
          title: 'FREE SUPPORT',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices dui sapien eget mi proin sed. Eget nulla facilisi etiam dignissim diam. Eu nisl nunc mi ipsum faucibus. Risus sed vulputate odio ut. Orci a scelerisque purus semper eget duis. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Ut faucibus pulvinar',
        },
        {
          icon: 'creditcard',
          title: 'AFFORDABLE',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices dui sapien eget mi proin sed. Eget nulla facilisi etiam dignissim diam. Eu nisl nunc mi ipsum faucibus. Risus sed vulputate odio ut. Orci a scelerisque purus semper eget duis. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Ut faucibus pulvinar',
        },
      ],
    },
    editData: FeaturedContentEdit,
  },
  TextColumnWithLinks: {
    group: 'Content',
    Component: 'TextColumnWithLinks',
    sampleData: {
      items: [
        {
          iconName: 'call',
          header: 'Header 1',
          subHeader:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices dui sapien eget mi proin sed. Eget nulla facilisi etiam dignissim diam. Eu nisl nunc mi ipsum faucibus. Risus sed vulputate odio ut. Orci a scelerisque purus semper eget duis. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Ut faucibus pulvinar',
        },
        {
          iconName: 'location',
          header: 'Header 2',
          subHeader: 'Sub header 2',
        },
        {
          iconName: 'home',
          header: 'Header 3',
          subHeader: 'Sub header 3',
        },
      ],
    },
    editData: TextColumnWithLinksEdit,
  },
  ContactUsInfo: {
    group: 'Content',
    Component: 'ContactUsInfo',
    sampleData: {
      items: [
        {
          iconName: 'call',
          iconColor: 'error',
          header: 'Call us',
          subHeader: '+91 21292 19222',
          iconSize: 'xxl',
        },
        {
          iconName: 'email-outline',
          iconColor: 'error',
          iconSize: 'xxl',
          header: 'Mail us',
          subHeader: 'info@example.com',
        },
        {
          iconName: 'share',
          iconColor: 'info',
          iconSize: 'xxl',
          header: 'Connect with us',
          subHeader: '',
          links: [
            {
              iconName: 'facebook',
              to: 'http://example.com',
              iconColor: 'info',
              target: '_blank',
            },
            {
              iconName: 'instagram',
              to: 'http://insta.com',
              iconColor: 'red',
              target: '_blank',
            },
          ],
        },
      ],
    },
    editData: ContactUsInfoEdit,
  },

  GetInTouch: {
    group: 'Content',
    Component: 'GetInTouch',
    sampleData: {
      header: 'Get in touch',
      info: [
        {
          iconName: 'message',
          text: 'email@example.com',
          href: 'mailto:email@example.com',
        },
        {
          iconName: 'call',
          href: 'call:101111111',
          text: '101.111.111',
        },
        {
          iconName: 'Computer',
          text: 'www.domain.com',
          href: 'www.domain.com',
          target: '_blank',
        },
      ],
      footerText:
        'Laborum ex duis ut labore eiusmod amet fugiat. Qui ullamco exercitation eu sint laborum. Magna aliquip adipisicing laborum anim anim id dolore ea tempor. Do cupidatat velit exercitation cupidatat magna anim. Nisi nulla est ad duis consectetur officia incididunt nostrud enim veniam incididunt veniam labore eu. Non minim deserunt laborum ullamco esse fugiat mollit deserunt consectetur velit dolore exercitation pariatur. Ex elit sunt occaecat cupidatat cillum elit aliqua veniam cupidatat nulla adipisicing.',
    },
    editData: GetInTouchEdit,
  },
  CodeHighlight: {
    group: 'Content',
    Component: 'CodeHighlight',
    sampleData: {
      code: 'funciton(a, b) {\n return a + b; \n }',
      language: 'javscript',
    },
    editData: CodeHighlightEdit,
  },

  Team: {
    group: 'Content',
    Component: 'Team',
    sampleData: {
      header: 'Meet the team',
      items: [
        {
          profilePic: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          header: 'John Peter',
          designation: 'Software Engineer',
          subHeader: 'Officia nulla elit do eu pariatur in esse amet. Ex est fugiat pariatur veniam laboris occaecat ad reprehenderit consequat nisi tempor do do ea. Proident non nostrud elit irure incididunt ea in eu qui incididunt pariatur reprehenderit eiusmod. Adipisicing elit voluptate adipisicing voluptate aliqua nisi sit.',
        },
        {
          profilePic: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          header: 'John Peter',
          designation: 'Software Engineer',
          subHeader: 'Officia nulla elit do eu pariatur in esse amet. Ex est fugiat pariatur veniam laboris occaecat ad reprehenderit consequat nisi tempor do do ea. Proident non nostrud elit irure incididunt ea in eu qui incididunt pariatur reprehenderit eiusmod. Adipisicing elit voluptate adipisicing voluptate aliqua nisi sit.',
        },
      ],
    },
    editData: TeamEdit,
  },
  ImageBlockWithText: {
    group: 'Content',
    Component: 'ImageBlockWithText',
    sampleData: {
      header: 'Meet the team',
      subHeader: 'Ipsum eu consequat nostrud nisi ut commodo anim labore labore exercitation dolore qui amet consequat. Anim amet laborum occaecat est aute occaecat. Velit anim adipisicing nostrud dolore quis. Laborum labore eu ad nisi est duis Lorem nulla aliquip tempor nisi.',
      imageUrl: 'https://st.depositphotos.com/2309453/3447/i/600/depositphotos_34479387-stock-photo-group-of-young-business-people.jpg',
    },
    editData: ImageBlockWithTextEdit,
  },
  ImageWithHeaderBody: {
    group: 'Content',
    Component: 'ImageWithHeaderBody',
    sampleData: {
      header: 'Mission',
      styleName: 'shadow',
      subHeader: 'Ipsum eu consequat nostrud nisi ut commodo anim labore labore exercitation dolore qui amet consequat. Anim amet laborum occaecat est aute occaecat. Velit anim adipisicing nostrud dolore quis. Laborum labore eu ad nisi est duis Lorem nulla aliquip tempor nisi.',
      imageUrl: 'https://w7.pngwing.com/pngs/691/585/png-transparent-computer-icons-business-mission-company-text-people-thumbnail.png',
    },
    editData: ImageWithHeaderBodyEdit,
  },
  Iframe: {
    group: 'Content',
    Component: 'Iframe',
    sampleData: {
      url: 'https://www.google.com',
    },
    editData: IframeEdit,
  },
  ImageWithSpotlight: {
    group: 'Content',
    Component: 'ImageWithSpotlight',
    sampleData: {
      header: 'Grow with us',
      bgImageUrl: 'https://img.freepik.com/free-photo/new-york-city-central-park-panorama_649448-89.jpg?w=2000&t=st=1683292030~exp=1683292630~hmac=b87b9d4a48fea6a2b3ed84f236b7f9213fc24948ed32023d554ff3e9c31d4315',
      actions: [
        {
          buttonText: 'Blogs',
          iconName: 'list',
          color: 'success',
        },
        {
          buttonText: 'Contact us',
          color: 'warning',
          iconName: 'call',
        },
        {
          buttonText: 'Support',
          iconName: 'person',
          color: 'error',
        },
      ],
    },
    editData: ImageWithSpotlightEdit,
  },
  HTML: {
    group: 'Content',
    Component: 'HTML',
    sampleData: {
      html: '<p>Here pu<span style="background-color: rgb(236, 202, 250);">t your ht</span>ml</p>',
    },
    editData: HTMLEdit,
  },
};

dynamicComponents.set(compList);
