import React from 'react';
import Loading from './components/Loading';
const ActionsComp = React.lazy(() => import('./components/Actions'));

const Actions = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ActionsComp {...props} />
    </React.Suspense>
);
};
const AlertComp = React.lazy(() => import('./components/Alert'));

const Alert = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <AlertComp {...props} />
    </React.Suspense>
);
};
const AutoCompleteValueComp = React.lazy(() => import('./components/AutoCompleteValue'));

const AutoCompleteValue = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <AutoCompleteValueComp {...props} />
    </React.Suspense>
);
};
const AutocompleteComp = React.lazy(() => import('./components/Autocomplete'));

const Autocomplete = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <AutocompleteComp {...props} />
    </React.Suspense>
);
};
const BasicRTEComp = React.lazy(() => import('./components/BasicRTE'));

const BasicRTE = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <BasicRTEComp {...props} />
    </React.Suspense>
);
};
const BottomNavigationComp = React.lazy(() => import('./components/BottomNavigation'));

const BottomNavigation = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <BottomNavigationComp {...props} />
    </React.Suspense>
);
};
const BoxRadioComp = React.lazy(() => import('./components/BoxRadio'));

const BoxRadio = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <BoxRadioComp {...props} />
    </React.Suspense>
);
};
const BreadCrumbComp = React.lazy(() => import('./components/BreadCrumb'));

const BreadCrumb = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <BreadCrumbComp {...props} />
    </React.Suspense>
);
};
const ButtonComp = React.lazy(() => import('./components/Button'));

const Button = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ButtonComp {...props} />
    </React.Suspense>
);
};
const ButtonSelectionComp = React.lazy(() => import('./components/ButtonSelection'));

const ButtonSelection = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ButtonSelectionComp {...props} />
    </React.Suspense>
);
};
const CallToActionComp = React.lazy(() => import('./components/CallToAction'));

const CallToAction = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CallToActionComp {...props} />
    </React.Suspense>
);
};
const CardComp = React.lazy(() => import('./components/Card'));

const Card = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CardComp {...props} />
    </React.Suspense>
);
};
const CardButtonComp = React.lazy(() => import('./components/CardButton'));

const CardButton = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CardButtonComp {...props} />
    </React.Suspense>
);
};
const CardButtonListComp = React.lazy(() => import('./components/CardButtonList'));

const CardButtonList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CardButtonListComp {...props} />
    </React.Suspense>
);
};
const CarouselComp = React.lazy(() => import('./components/Carousel'));

const Carousel = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CarouselComp {...props} />
    </React.Suspense>
);
};
const ChartComp = React.lazy(() => import('./components/Chart'));

const Chart = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ChartComp {...props} />
    </React.Suspense>
);
};
const CheckboxComp = React.lazy(() => import('./components/Checkbox'));

const Checkbox = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CheckboxComp {...props} />
    </React.Suspense>
);
};
const CheckboxListComp = React.lazy(() => import('./components/CheckboxList'));

const CheckboxList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CheckboxListComp {...props} />
    </React.Suspense>
);
};
const CodeHighlightComp = React.lazy(() => import('./components/CodeHighlight'));

const CodeHighlight = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CodeHighlightComp {...props} />
    </React.Suspense>
);
};
const ColorPickerComp = React.lazy(() => import('./components/ColorPicker'));

const ColorPicker = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ColorPickerComp {...props} />
    </React.Suspense>
);
};
const CompRendererComp = React.lazy(() => import('./components/CompRenderer'));

const CompRenderer = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CompRendererComp {...props} />
    </React.Suspense>
);
};
const ContactUsInfoComp = React.lazy(() => import('./components/ContactUsInfo'));

const ContactUsInfo = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ContactUsInfoComp {...props} />
    </React.Suspense>
);
};
const CustomButtonComp = React.lazy(() => import('./components/CustomButton'));

const CustomButton = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CustomButtonComp {...props} />
    </React.Suspense>
);
};
const CustomMenuComp = React.lazy(() => import('./components/CustomMenu'));

const CustomMenu = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <CustomMenuComp {...props} />
    </React.Suspense>
);
};
const DataFieldComp = React.lazy(() => import('./components/DataField'));

const DataField = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DataFieldComp {...props} />
    </React.Suspense>
);
};
const DataFieldListComp = React.lazy(() => import('./components/DataFieldList'));

const DataFieldList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DataFieldListComp {...props} />
    </React.Suspense>
);
};
const DataListComp = React.lazy(() => import('./components/DataList'));

const DataList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DataListComp {...props} />
    </React.Suspense>
);
};
const DateSelectorComp = React.lazy(() => import('./components/DateSelector'));

const DateSelector = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DateSelectorComp {...props} />
    </React.Suspense>
);
};
const DefaultComp = React.lazy(() => import('./components/Default'));

const Default = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DefaultComp {...props} />
    </React.Suspense>
);
};
const DialogComp = React.lazy(() => import('./components/Dialog'));

const Dialog = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DialogComp {...props} />
    </React.Suspense>
);
};
const DisclaimerComp = React.lazy(() => import('./components/Disclaimer'));

const Disclaimer = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DisclaimerComp {...props} />
    </React.Suspense>
);
};
const DropSelectionComp = React.lazy(() => import('./components/DropSelection'));

const DropSelection = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DropSelectionComp {...props} />
    </React.Suspense>
);
};
const DropZoneFileComp = React.lazy(() => import('./components/DropZoneFile'));

const DropZoneFile = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <DropZoneFileComp {...props} />
    </React.Suspense>
);
};
const EditableFieldComp = React.lazy(() => import('./components/EditableField'));

const EditableField = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <EditableFieldComp {...props} />
    </React.Suspense>
);
};
const FeaturedContentComp = React.lazy(() => import('./components/FeaturedContent'));

const FeaturedContent = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <FeaturedContentComp {...props} />
    </React.Suspense>
);
};
const FieldTextComp = React.lazy(() => import('./components/FieldText'));

const FieldText = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <FieldTextComp {...props} />
    </React.Suspense>
);
};
const FileUploaderComp = React.lazy(() => import('./components/FileUploader'));

const FileUploader = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <FileUploaderComp {...props} />
    </React.Suspense>
);
};
const FloatingActionButtonComp = React.lazy(() => import('./components/FloatingActionButton'));

const FloatingActionButton = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <FloatingActionButtonComp {...props} />
    </React.Suspense>
);
};
const FooterComp = React.lazy(() => import('./components/Footer'));

const Footer = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <FooterComp {...props} />
    </React.Suspense>
);
};
const FormComp = React.lazy(() => import('./components/Form'));

const Form = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <FormComp {...props} />
    </React.Suspense>
);
};
const FormListComp = React.lazy(() => import('./components/FormList'));

const FormList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <FormListComp {...props} />
    </React.Suspense>
);
};
const FormObjectComp = React.lazy(() => import('./components/FormObject'));

const FormObject = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <FormObjectComp {...props} />
    </React.Suspense>
);
};
const GetInTouchComp = React.lazy(() => import('./components/GetInTouch'));

const GetInTouch = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <GetInTouchComp {...props} />
    </React.Suspense>
);
};
const GlobalNavigationComp = React.lazy(() => import('./components/GlobalNavigation'));

const GlobalNavigation = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <GlobalNavigationComp {...props} />
    </React.Suspense>
);
};
const GlobalNavigationV2Comp = React.lazy(() => import('./components/GlobalNavigationV2'));

const GlobalNavigationV2 = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <GlobalNavigationV2Comp {...props} />
    </React.Suspense>
);
};
const GridComp = React.lazy(() => import('./components/Grid'));

const Grid = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <GridComp {...props} />
    </React.Suspense>
);
};
const GrouperComp = React.lazy(() => import('./components/Grouper'));

const Grouper = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <GrouperComp {...props} />
    </React.Suspense>
);
};
const HTMLComp = React.lazy(() => import('./components/HTML'));

const HTML = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <HTMLComp {...props} />
    </React.Suspense>
);
};
const HeaderComp = React.lazy(() => import('./components/Header'));

const Header = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <HeaderComp {...props} />
    </React.Suspense>
);
};
const HeaderWithTilesComp = React.lazy(() => import('./components/HeaderWithTiles'));

const HeaderWithTiles = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <HeaderWithTilesComp {...props} />
    </React.Suspense>
);
};
const HeroContentComp = React.lazy(() => import('./components/HeroContent'));

const HeroContent = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <HeroContentComp {...props} />
    </React.Suspense>
);
};
const IconComp = React.lazy(() => import('./components/Icon'));

const Icon = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <IconComp {...props} />
    </React.Suspense>
);
};
const IconButtonComp = React.lazy(() => import('./components/IconButton'));

const IconButton = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <IconButtonComp {...props} />
    </React.Suspense>
);
};
const IconCalendarComp = React.lazy(() => import('./components/IconCalendar'));

const IconCalendar = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <IconCalendarComp {...props} />
    </React.Suspense>
);
};
const IconSelectorComp = React.lazy(() => import('./components/IconSelector'));

const IconSelector = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <IconSelectorComp {...props} />
    </React.Suspense>
);
};
const IframeComp = React.lazy(() => import('./components/Iframe'));

const Iframe = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <IframeComp {...props} />
    </React.Suspense>
);
};
const ImageComp = React.lazy(() => import('./components/Image'));

const Image = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageComp {...props} />
    </React.Suspense>
);
};
const ImageBlockWithTextComp = React.lazy(() => import('./components/ImageBlockWithText'));

const ImageBlockWithText = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageBlockWithTextComp {...props} />
    </React.Suspense>
);
};
const ImageCardComp = React.lazy(() => import('./components/ImageCard'));

const ImageCard = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageCardComp {...props} />
    </React.Suspense>
);
};
const ImageCardListComp = React.lazy(() => import('./components/ImageCardList'));

const ImageCardList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageCardListComp {...props} />
    </React.Suspense>
);
};
const ImageInfoSliderComp = React.lazy(() => import('./components/ImageInfoSlider'));

const ImageInfoSlider = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageInfoSliderComp {...props} />
    </React.Suspense>
);
};
const ImageOnDeviceComp = React.lazy(() => import('./components/ImageOnDevice'));

const ImageOnDevice = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageOnDeviceComp {...props} />
    </React.Suspense>
);
};
const ImageUploaderComp = React.lazy(() => import('./components/ImageUploader'));

const ImageUploader = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageUploaderComp {...props} />
    </React.Suspense>
);
};
const ImageWithHeaderBodyComp = React.lazy(() => import('./components/ImageWithHeaderBody'));

const ImageWithHeaderBody = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageWithHeaderBodyComp {...props} />
    </React.Suspense>
);
};
const ImageWithSlideComp = React.lazy(() => import('./components/ImageWithSlide'));

const ImageWithSlide = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageWithSlideComp {...props} />
    </React.Suspense>
);
};
const ImageWithSlideListComp = React.lazy(() => import('./components/ImageWithSlideList'));

const ImageWithSlideList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageWithSlideListComp {...props} />
    </React.Suspense>
);
};
const ImageWithSpotlightComp = React.lazy(() => import('./components/ImageWithSpotlight'));

const ImageWithSpotlight = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ImageWithSpotlightComp {...props} />
    </React.Suspense>
);
};
const InProgressComp = React.lazy(() => import('./components/InProgress'));

const InProgress = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <InProgressComp {...props} />
    </React.Suspense>
);
};
const InputComp = React.lazy(() => import('./components/Input'));

const Input = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <InputComp {...props} />
    </React.Suspense>
);
};
const InputWithOptionsComp = React.lazy(() => import('./components/InputWithOptions'));

const InputWithOptions = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <InputWithOptionsComp {...props} />
    </React.Suspense>
);
};
const LabelComp = React.lazy(() => import('./components/Label'));

const Label = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <LabelComp {...props} />
    </React.Suspense>
);
};
const LabelValueComp = React.lazy(() => import('./components/LabelValue'));

const LabelValue = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <LabelValueComp {...props} />
    </React.Suspense>
);
};
const LaunchTimerComp = React.lazy(() => import('./components/LaunchTimer'));

const LaunchTimer = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <LaunchTimerComp {...props} />
    </React.Suspense>
);
};
const LeftNavigationComp = React.lazy(() => import('./components/LeftNavigation'));

const LeftNavigation = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <LeftNavigationComp {...props} />
    </React.Suspense>
);
};
const LinkComp = React.lazy(() => import('./components/Link'));

const Link = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <LinkComp {...props} />
    </React.Suspense>
);
};
const LinkBlockComp = React.lazy(() => import('./components/LinkBlock'));

const LinkBlock = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <LinkBlockComp {...props} />
    </React.Suspense>
);
};
const LinkButtonComp = React.lazy(() => import('./components/LinkButton'));

const LinkButton = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <LinkButtonComp {...props} />
    </React.Suspense>
);
};
const LinkButtonListComp = React.lazy(() => import('./components/LinkButtonList'));

const LinkButtonList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <LinkButtonListComp {...props} />
    </React.Suspense>
);
};
const ListComp = React.lazy(() => import('./components/List'));

const List = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ListComp {...props} />
    </React.Suspense>
);
};
const MagicHeroContentComp = React.lazy(() => import('./components/MagicHeroContent'));

const MagicHeroContent = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <MagicHeroContentComp {...props} />
    </React.Suspense>
);
};
const MoreActionsComp = React.lazy(() => import('./components/MoreActions'));

const MoreActions = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <MoreActionsComp {...props} />
    </React.Suspense>
);
};
const MoreContentComp = React.lazy(() => import('./components/MoreContent'));

const MoreContent = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <MoreContentComp {...props} />
    </React.Suspense>
);
};
const NavTabsComp = React.lazy(() => import('./components/NavTabs'));

const NavTabs = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <NavTabsComp {...props} />
    </React.Suspense>
);
};
const NavigationComp = React.lazy(() => import('./components/Navigation'));

const Navigation = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <NavigationComp {...props} />
    </React.Suspense>
);
};
const NavigationListComp = React.lazy(() => import('./components/NavigationList'));

const NavigationList = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <NavigationListComp {...props} />
    </React.Suspense>
);
};
const PaginationComp = React.lazy(() => import('./components/Pagination'));

const Pagination = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <PaginationComp {...props} />
    </React.Suspense>
);
};
const PopupMessageComp = React.lazy(() => import('./components/PopupMessage'));

const PopupMessage = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <PopupMessageComp {...props} />
    </React.Suspense>
);
};
const PricingComp = React.lazy(() => import('./components/Pricing'));

const Pricing = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <PricingComp {...props} />
    </React.Suspense>
);
};
const ProgressComp = React.lazy(() => import('./components/Progress'));

const Progress = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ProgressComp {...props} />
    </React.Suspense>
);
};
const ProgressIndicatorComp = React.lazy(() => import('./components/ProgressIndicator'));

const ProgressIndicator = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ProgressIndicatorComp {...props} />
    </React.Suspense>
);
};
const PropsTableComp = React.lazy(() => import('./components/PropsTable'));

const PropsTable = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <PropsTableComp {...props} />
    </React.Suspense>
);
};
const RadioComp = React.lazy(() => import('./components/Radio'));

const Radio = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <RadioComp {...props} />
    </React.Suspense>
);
};
const ReCaptchaComp = React.lazy(() => import('./components/ReCaptcha'));

const ReCaptcha = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <ReCaptchaComp {...props} />
    </React.Suspense>
);
};
const RepeaterComp = React.lazy(() => import('./components/Repeater'));

const Repeater = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <RepeaterComp {...props} />
    </React.Suspense>
);
};
const RichTextComp = React.lazy(() => import('./components/RichText'));

const RichText = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <RichTextComp {...props} />
    </React.Suspense>
);
};
const SelectComp = React.lazy(() => import('./components/Select'));

const Select = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SelectComp {...props} />
    </React.Suspense>
);
};
const SelectPopupComp = React.lazy(() => import('./components/SelectPopup'));

const SelectPopup = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SelectPopupComp {...props} />
    </React.Suspense>
);
};
const SeparatorComp = React.lazy(() => import('./components/Separator'));

const Separator = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SeparatorComp {...props} />
    </React.Suspense>
);
};
const SimpleDialogComp = React.lazy(() => import('./components/SimpleDialog'));

const SimpleDialog = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SimpleDialogComp {...props} />
    </React.Suspense>
);
};
const SkeletonComp = React.lazy(() => import('./components/Skeleton'));

const Skeleton = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SkeletonComp {...props} />
    </React.Suspense>
);
};
const SliderComp = React.lazy(() => import('./components/Slider'));

const Slider = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SliderComp {...props} />
    </React.Suspense>
);
};
const SnackbarComp = React.lazy(() => import('./components/Snackbar'));

const Snackbar = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SnackbarComp {...props} />
    </React.Suspense>
);
};
const SpeedDialComp = React.lazy(() => import('./components/SpeedDial'));

const SpeedDial = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SpeedDialComp {...props} />
    </React.Suspense>
);
};
const SwitchComp = React.lazy(() => import('./components/Switch'));

const Switch = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <SwitchComp {...props} />
    </React.Suspense>
);
};
const TabsComp = React.lazy(() => import('./components/Tabs'));

const Tabs = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TabsComp {...props} />
    </React.Suspense>
);
};
const TagDropdownComp = React.lazy(() => import('./components/TagDropdown'));

const TagDropdown = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TagDropdownComp {...props} />
    </React.Suspense>
);
};
const TagLabelComp = React.lazy(() => import('./components/TagLabel'));

const TagLabel = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TagLabelComp {...props} />
    </React.Suspense>
);
};
const TagSelectionComp = React.lazy(() => import('./components/TagSelection'));

const TagSelection = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TagSelectionComp {...props} />
    </React.Suspense>
);
};
const TeamComp = React.lazy(() => import('./components/Team'));

const Team = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TeamComp {...props} />
    </React.Suspense>
);
};
const TextComp = React.lazy(() => import('./components/Text'));

const Text = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TextComp {...props} />
    </React.Suspense>
);
};
const TextColumnWithLinksComp = React.lazy(() => import('./components/TextColumnWithLinks'));

const TextColumnWithLinks = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TextColumnWithLinksComp {...props} />
    </React.Suspense>
);
};
const TextFieldsComp = React.lazy(() => import('./components/TextFields'));

const TextFields = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TextFieldsComp {...props} />
    </React.Suspense>
);
};
const TextWithImageTilesComp = React.lazy(() => import('./components/TextWithImageTiles'));

const TextWithImageTiles = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TextWithImageTilesComp {...props} />
    </React.Suspense>
);
};
const TextareaComp = React.lazy(() => import('./components/Textarea'));

const Textarea = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TextareaComp {...props} />
    </React.Suspense>
);
};
const TickerComp = React.lazy(() => import('./components/Ticker'));

const Ticker = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <TickerComp {...props} />
    </React.Suspense>
);
};
const UsefulLinksComp = React.lazy(() => import('./components/UsefulLinks'));

const UsefulLinks = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <UsefulLinksComp {...props} />
    </React.Suspense>
);
};
const UserMenuComp = React.lazy(() => import('./components/UserMenu'));

const UserMenu = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <UserMenuComp {...props} />
    </React.Suspense>
);
};
const WrapperComp = React.lazy(() => import('./components/Wrapper'));

const Wrapper = (props) => {
return (
    <React.Suspense fallback={<Loading />}>
        <WrapperComp {...props} />
    </React.Suspense>
);
};
const components = {
  Actions,
  Alert,
  AutoCompleteValue,
  Autocomplete,
  BasicRTE,
  BottomNavigation,
  BoxRadio,
  BreadCrumb,
  Button,
  ButtonSelection,
  CallToAction,
  Card,
  CardButton,
  CardButtonList,
  Carousel,
  Chart,
  Checkbox,
  CheckboxList,
  CodeHighlight,
  ColorPicker,
  CompRenderer,
  ContactUsInfo,
  CustomButton,
  CustomMenu,
  DataField,
  DataFieldList,
  DataList,
  DateSelector,
  Default,
  Dialog,
  Disclaimer,
  DropSelection,
  DropZoneFile,
  EditableField,
  FeaturedContent,
  FieldText,
  FileUploader,
  FloatingActionButton,
  Footer,
  Form,
  FormList,
  FormObject,
  GetInTouch,
  GlobalNavigation,
  GlobalNavigationV2,
  Grid,
  Grouper,
  HTML,
  Header,
  HeaderWithTiles,
  HeroContent,
  Icon,
  IconButton,
  IconCalendar,
  IconSelector,
  Iframe,
  Image,
  ImageBlockWithText,
  ImageCard,
  ImageCardList,
  ImageInfoSlider,
  ImageOnDevice,
  ImageUploader,
  ImageWithHeaderBody,
  ImageWithSlide,
  ImageWithSlideList,
  ImageWithSpotlight,
  InProgress,
  Input,
  InputWithOptions,
  Label,
  LabelValue,
  LaunchTimer,
  LeftNavigation,
  Link,
  LinkBlock,
  LinkButton,
  LinkButtonList,
  List,
  Loading,
  MagicHeroContent,
  MoreActions,
  MoreContent,
  NavTabs,
  Navigation,
  NavigationList,
  Pagination,
  PopupMessage,
  Pricing,
  Progress,
  ProgressIndicator,
  PropsTable,
  Radio,
  ReCaptcha,
  Repeater,
  RichText,
  Select,
  SelectPopup,
  Separator,
  SimpleDialog,
  Skeleton,
  Slider,
  Snackbar,
  SpeedDial,
  Switch,
  Tabs,
  TagDropdown,
  TagLabel,
  TagSelection,
  Team,
  Text,
  TextColumnWithLinks,
  TextFields,
  TextWithImageTiles,
  Textarea,
  Ticker,
  UsefulLinks,
  UserMenu,
  Wrapper,
};
export { components };