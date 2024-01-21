import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { fake } from '../../../tests/ui';
import '../../index';
import { DynamicContent } from './index';
import { redirectTo } from '../../utils/redirect';
import { containers } from '../../utils/storage';
import { utils } from '../../index';
jest.mock('../../utils/redirect');

describe('DynamicContent', () => {
  describe('Loading page from server', () => {
    let mockProps;
    let _container;
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create(),
        store: fake.store.create(),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });
    test('should render DynamicContent with defaults', async () => {
      expect(_container.getElementsByClassName('dynamic-content').length).toBe(
        1
      );
    });
    test('should call fetchPageContent', async () => {
      expect(mockProps.contentActions.fetchContentPage).toHaveBeenCalled();
    });
  });

  describe('Rendering content page', () => {
    let mockProps;
    let _container;
    let pageResponse;
    beforeEach(async () => {
      pageResponse = {
        pageData: {
          analytics: {
            load: {
              section: 'home',
              subsection: 'hero-ad',
            },
          },
          hook: {
            load: {
              url: '/api/tobe',
              method: 'post',
            },
            // afterLoad: {
            //   url: '/api/afterload',
            //   method: 'post',
            // },
          },
          title: 'Test page 1',
          reset: {
            type: 'clearAll',
          },
          items: [
            {
              component: 'Form',
              name: 'test',
              fields: [
                {
                  cmpType: 'Input',
                  name: 'name1',
                  label: 'Test Label 1',
                },
              ],
            },
          ],
        },
      };
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        onAnalytics: jest.fn(),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: pageResponse,
          },
        }),
        store: fake.store.create(),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });
    test('should render Form with defaults', async () => {
      expect(_container.getElementsByClassName('sq-form').length).toBe(1);
    });
    test('should call update state onChange() event', async () => {
      await fireEvent.change(screen.getByTestId('test_label_1_input'), {
        target: { value: 'test' },
      });
      expect(mockProps.contentActions.updateUserData).toHaveBeenCalledWith({
        test: {
          name1: 'test',
        },
      });
      expect(mockProps.contentActions.mergeUserData).toHaveBeenCalledWith(
        undefined
      );
    });
    test('should call reset on start', async () => {
      expect(mockProps.contentActions.resetUserData).toHaveBeenCalledWith({
        type: 'clearAll',
      });
    });
    test('should call on Analytics', async () => {
      expect(mockProps.contentActions.resetUserData).toHaveBeenCalledWith({
        type: 'clearAll',
      });
    });
    test('should call on Analytics() for pageview', async () => {
      expect(mockProps.onAnalytics).toHaveBeenCalledWith({
        type: 'pageview',
        page_title: 'Test page 1',
        section: 'home',
        subsection: 'hero-ad',
      });
    });
    test('should call on postApi() for hook.load', async () => {
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          url: '/api/tobe',
          method: 'post',
        },
        pageResponse
      );
    });
    //test('should call on postApi() for hook.afterLoad', async () => {
    //   expect(mockProps.contentActions.postApi).toHaveBeenCalledWith({
    //     url: '/api/afterload',
    //     method: 'post',
    //   });
    // });
  });

  describe('Form with failed validations', () => {
    let mockProps;
    let _container;
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: {
              pageData: {
                items: [
                  {
                    component: 'Form',
                    name: 'test2',
                    fields: [
                      {
                        cmpType: 'Input',
                        name: 'name2',
                        label: 'Test Label 2',
                        validators: [
                          {
                            type: 'required',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    component: 'Button',
                    buttonText: 'Submit',
                    actionType: 'submit',
                  },
                ],
              },
            },
          },
        }),
        store: fake.store.create(),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });
    test('should create error object if validaitons are not passed', async () => {
      await fireEvent.change(screen.getByTestId('test_label_2_input'), {
        target: { value: ' ' },
      });
      expect(mockProps.contentActions.updateUserData).toHaveBeenNthCalledWith(
        2,
        {
          test2_errors: {
            name2: {
              error: true,
              errorMessage: 'This field is required',
            },
          },
        }
      );
      expect(mockProps.contentActions.updateUserData).toHaveBeenNthCalledWith(
        3,
        {
          test2: {
            name2: ' ',
          },
        }
      );
      expect(mockProps.contentActions.mergeUserData).toHaveBeenCalledWith(
        undefined
      );
    });
    test('should not call to postApi()', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.postApi).not.toHaveBeenCalled();
    });
  });

  describe('Form with correct  data', () => {
    let mockProps;
    let _container;
    const pageResponse = {
      pageData: {
        hook: {
          load: [
            {
              url: '/api/tobe/1',
              method: 'post',
            },
            {
              url: '/api/tobe/2',
              method: 'post',
            },
          ],
        },
        items: [
          {
            component: 'Form',
            name: 'test2',
            fields: [
              {
                cmpType: 'Input',
                name: 'name2',
                label: 'Test Label 2',
                validators: [
                  {
                    type: 'required',
                  },
                ],
              },
            ],
          },
          {
            component: 'Button',
            buttonText: 'Submit',
            actionType: 'submit',
          },
        ],
      },
    };
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: pageResponse,
          },
        }),
        store: fake.store.create({
          userData: {
            test2: {
              name2: 'hi',
            },
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });
    test('should call to postApi()', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
        jest.advanceTimersByTime(200);
      });
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          actionType: 'submit',
          buttonText: 'Submit',
          component: 'Button',
        },
        pageResponse
      );
    });
    test('should call to postApi() for hook.load twice', async () => {
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          url: '/api/tobe/1',
          method: 'post',
        },
        pageResponse
      );
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          url: '/api/tobe/2',
          method: 'post',
        },
        pageResponse
      );
    });
  });

  describe('Form inside Wrapper component', () => {
    let mockProps;
    let _container;
    const pageResponse = {
      pageData: {
        items: [
          {
            component: 'Wrapper',
            items: [
              {
                component: 'Form',
                name: 'test2',
                fields: [
                  {
                    cmpType: 'Input',
                    name: 'name2',
                    label: 'Test Label 2',
                    validators: [
                      {
                        type: 'required',
                      },
                    ],
                  },
                ],
              },
              {
                component: 'Button',
                buttonText: 'Submit',
                actionType: 'submit',
              },
            ],
          },
        ],
      },
    };
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: pageResponse,
          },
        }),
        store: fake.store.create({
          userData: {
            test2: {
              name2: 'hi',
            },
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });
    test('should call to postApi() with nested in <Wrapper/>', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          actionType: 'submit',
          buttonText: 'Submit',
          component: 'Button',
        },
        pageResponse
      );
    });
  });

  describe('Form validations (failed) inside deep Wrapper component', () => {
    let mockProps;
    let _container;
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: {
              pageData: {
                items: [
                  {
                    component: 'Wrapper',
                    className: 'level1',
                    items: [
                      {
                        component: 'Wrapper',
                        className: 'level2',
                        items: [
                          {
                            component: 'Wrapper',
                            className: 'level3',
                            items: [
                              {
                                component: 'Form',
                                name: 'test2',
                                fields: [
                                  {
                                    cmpType: 'Input',
                                    name: 'name2',
                                    label: 'Test Label 2',
                                    validators: [
                                      {
                                        type: 'required',
                                      },
                                    ],
                                  },
                                ],
                                actions: [
                                  {
                                    actionType: 'submit-form',
                                    buttonText: 'Submit Form',
                                  },
                                ],
                              },
                              {
                                component: 'Button',
                                buttonText: 'Submit',
                                actionType: 'submit',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        }),
        store: fake.store.create({
          userData: {
            test2: {},
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });
    test('should call to postApi() with nested in <Wrapper/>', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.postApi).not.toHaveBeenCalledWith();
    });
    test('should set error object for [name2] failed field', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.updateUserData).toHaveBeenCalledWith({
        test2_errors: {
          name2: {
            error: true,
            errorMessage: 'This field is required',
          },
        },
      });
    });
    test('should set error object for [name2] failed field with submit-form', async () => {
      await fireEvent.click(screen.getByTestId('submit_form_button'));
      expect(mockProps.contentActions.updateUserData).toHaveBeenCalledWith({
        test2_errors: {
          name2: {
            error: true,
            errorMessage: 'This field is required',
          },
        },
      });
    });
  });

  describe('Form validations (success) inside deep Wrapper component', () => {
    let mockProps;
    let _container;
    const pageResponse = {
      pageData: {
        items: [
          {
            component: 'Wrapper',
            className: 'level1',
            items: [
              {
                component: 'Wrapper',
                className: 'level2',
                items: [
                  {
                    component: 'Wrapper',
                    className: 'level3',
                    items: [
                      {
                        component: 'Form',
                        name: 'test2',
                        fields: [
                          {
                            cmpType: 'Input',
                            name: 'name2',
                            label: 'Test Label 2',
                            validators: [
                              {
                                type: 'required',
                              },
                            ],
                          },
                        ],
                        actions: [
                          {
                            actionType: 'submit-form',
                            buttonText: 'Submit Form',
                          },
                        ],
                      },
                      {
                        component: 'Button',
                        buttonText: 'Submit',
                        actionType: 'submit',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: pageResponse,
          },
        }),
        store: fake.store.create({
          userData: {
            test2: {
              name2: 'hi',
            },
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });

    test('should call postApi() with submit-form', async () => {
      await fireEvent.click(screen.getByTestId('submit_form_button'));
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          actionType: 'submit-form',
          buttonText: 'Submit Form',
        },
        pageResponse
      );
    });
  });

  describe('Form validation with formGroup', () => {
    let mockProps;
    let _container;
    const pageResponse = {
      pageData: {
        items: [
          {
            component: 'Form',
            name: 'g1',
            group: 'nameblock',
            fields: [
              {
                cmpType: 'Input',
                name: 'name',
                label: 'Name G1',
                validators: [
                  {
                    type: 'required',
                  },
                ],
              },
            ],
          },
          {
            component: 'Form',
            name: 'g2',
            group: 'addressblock',
            fields: [
              {
                cmpType: 'Input',
                name: 'name',
                label: 'Name G2',
                validators: [
                  {
                    type: 'required',
                  },
                ],
              },
            ],
          },
          {
            component: 'Form',
            name: 'g3',
            group: ['addressblock', 'powerblock'],
            fields: [
              {
                cmpType: 'Input',
                name: 'name',
                label: 'Name G3',
                validators: [
                  {
                    type: 'required',
                  },
                ],
              },
            ],
          },
          {
            component: 'Button',
            buttonText: 'Submit',
            actionType: 'submit',
            validateGroup: 'nameblock',
          },
          {
            component: 'Button',
            buttonText: 'Submit Power',
            actionType: 'submit',
            validateGroup: 'powerblock',
          },
        ],
      },
    };
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: pageResponse,
          },
        }),
        store: fake.store.create({
          userData: {
            g1: {
              name: 'global name 1',
            },
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });
    test('should call to postApi()', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          actionType: 'submit',
          buttonText: 'Submit',
          component: 'Button',
          validateGroup: 'nameblock',
        },
        pageResponse
      );
    });
    test('should not call to postApi() in case of "Submit Power"', async () => {
      await fireEvent.click(screen.getByTestId('submit_power_button'));
      expect(mockProps.contentActions.postApi).not.toHaveBeenCalledWith();
    });
    test('should call updateUserData with error in case of "Submit Power"', async () => {
      await fireEvent.click(screen.getByTestId('submit_power_button'));
      expect(mockProps.contentActions.updateUserData).toHaveBeenCalledWith({
        g3_errors: {
          name: {
            error: true,
            errorMessage: 'This field is required',
          },
        },
      });
    });
  });

  describe('Form validation with fields .match', () => {
    let mockProps;
    let _container;
    const pageResponse = {
      pageData: {
        items: [
          {
            component: 'Form',
            name: 'contact',
            fields: [
              {
                cmpType: 'Input',
                name: 'name',
                label: 'Name G1',
                validators: [
                  {
                    type: 'required',
                  },
                ],
              },
            ],
            match: {
              test: {
                validators: [
                  {
                    type: 'equals',
                    matchValue: 'NOTOK',
                  },
                ],
              },
            },
          },
          {
            component: 'Form',
            name: 'address',
            fields: [
              {
                cmpType: 'Input',
                name: 'line1',
                label: 'Name G2',
                validators: [
                  {
                    type: 'required',
                  },
                ],
                match: {
                  test: {
                    validators: [
                      {
                        type: 'equals',
                        matchValue: 'NOTOK',
                      },
                    ],
                  },
                },
              },
              {
                cmpType: 'Input',
                name: 'country',
                label: 'Country G2',
                validators: [
                  {
                    type: 'required',
                  },
                ],
                match: {
                  test: {
                    validators: [
                      {
                        type: 'equals',
                        matchValue: 'NOTOK',
                      },
                    ],
                  },
                },
              },
            ],
          },
          {
            component: 'Button',
            buttonText: 'Submit',
            actionType: 'submit',
          },
        ],
      },
    };
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: pageResponse,
          },
        }),
        store: fake.store.create({
          userData: {
            contact: {
              name: 'global name 1',
            },
            address: {
              line1: 'global name 2',
            },
            test: 'OK',
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });
    test('should not render form field if not matched', async () => {
      expect(() => getByTestId('country_g2_input')).toThrow();
    });
    test('should call to postApi() and consider only matched fields', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          actionType: 'submit',
          buttonText: 'Submit',
          component: 'Button',
        },
        pageResponse
      );
    });
  });

  describe('Form validation with .match', () => {
    let mockProps;
    let _container;
    const pageResponse = {
      pageData: {
        items: [
          {
            component: 'Form',
            name: 'contact',
            fields: [
              {
                cmpType: 'Input',
                name: 'name',
                label: 'Name G1',
                validators: [
                  {
                    type: 'required',
                  },
                ],
              },
            ],
          },
          {
            component: 'Form',
            name: 'address',
            fields: [
              {
                cmpType: 'Input',
                name: 'line1',
                label: 'Name G2',
                validators: [
                  {
                    type: 'required',
                  },
                ],
              },
              {
                cmpType: 'Input',
                name: 'country',
                label: 'Country G2',
                validators: [
                  {
                    type: 'required',
                  },
                ],
              },
            ],
            forceValidate: true,
            match: {
              test: {
                validators: [
                  {
                    type: 'equals',
                    matchValue: 'NOTOK',
                  },
                ],
              },
            },
          },
          {
            component: 'Button',
            buttonText: 'Submit',
            actionType: 'submit',
          },
        ],
      },
    };
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: pageResponse,
          },
        }),
        store: fake.store.create({
          userData: {
            contact: {
              name: 'global name 1',
            },
            address: {
              line1: 'global name 2',
            },
            test: 'OK',
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });

    test('should not render form field if not matched', async () => {
      expect(() => getByTestId('country_g2_input')).toThrow();
    });
    test('should call to postApi() and consider only matched fields', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.postApi).not.toHaveBeenCalledWith(
        {
          actionType: 'submit',
          buttonText: 'Submit',
          component: 'Button',
        },
        pageResponse
      );
    });
  });

  describe('Parsing errors from results', () => {
    let mockProps;
    let _container;
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: {
              pageData: {
                items: [
                  {
                    component: 'Form',
                    name: 'address',
                    fields: [
                      {
                        cmpType: 'Input',
                        name: 'country',
                        label: 'Country G2',
                        validators: [
                          {
                            type: 'required',
                          },
                        ],
                        match: {
                          test: {
                            validators: [
                              {
                                type: 'equals',
                                matchValue: 'NOTOK',
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: 'Button',
                    buttonText: 'Submit',
                    actionType: 'submit',
                  },
                ],
              },
            },
          },
          postApi: {
            status: 'error',
            error: {
              errors: {
                address: {
                  errors: {
                    line1: {
                      error: true,
                      errorMessage: 'Validation failed',
                    },
                  },
                },
                g1: {
                  error: true,
                  errorMessage: 'Validation failed',
                },
              },
            },
          },
        }),
        store: fake.store.create({
          userData: {
            address: {
              line1: 'global name 2',
            },
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });

    test('should call to updateUserData() with result.errors.error structure', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.updateUserData).toHaveBeenCalledWith({
        address_errors: {
          line1: {
            error: true,
            errorMessage: 'Validation failed',
          },
        },
      });
    });
    test('should call to updateUserData() with result.errors[key] structure', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(mockProps.contentActions.updateUserData).toHaveBeenCalledWith({
        g1_errors: {
          error: true,
          errorMessage: 'Validation failed',
        },
      });
    });
  });

  describe('redirection to page for "success"', () => {
    let mockProps;
    let _container;
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: {
              pageData: {
                items: [
                  {
                    component: 'Form',
                    name: 'address',
                    fields: [
                      {
                        cmpType: 'Input',
                        name: 'country',
                        label: 'Country G2',
                        validators: [
                          {
                            type: 'required',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    component: 'Button',
                    buttonText: 'Submit',
                    actionType: 'submit',
                  },
                ],
              },
            },
          },
          postApi: {
            status: 'success',
            data: {
              redirect: 'page_2',
            },
          },
        }),
        store: fake.store.create({
          userData: {
            address: {
              country: 'global name 2',
            },
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });

    test('should call to redirectTo() for page_2', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(redirectTo).toHaveBeenCalledWith('page_2');
    });
  });

  describe('redirection to page for "error"', () => {
    let mockProps;
    let _container;
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: {
              pageData: {
                items: [
                  {
                    component: 'Form',
                    name: 'address',
                    fields: [
                      {
                        cmpType: 'Input',
                        name: 'country',
                        label: 'Country G2',
                        validators: [
                          {
                            type: 'required',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    component: 'Button',
                    buttonText: 'Submit',
                    actionType: 'submit',
                  },
                ],
              },
            },
          },
          postApi: {
            status: 'error',
            error: {
              redirect: 'error',
            },
          },
        }),
        store: fake.store.create({
          userData: {
            address: {
              country: 'global name 2',
            },
          },
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });

    test('should call to redirectTo() for error', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('submit_button'));
      });
      expect(redirectTo).toHaveBeenCalledWith('error');
    });
  });

  describe('Actions', () => {
    let mockProps;
    let _container;
    const pageResponse = {
      pageData: {
        items: [
          {
            component: 'Form',
            name: 'address',
            fields: [
              {
                cmpType: 'Input',
                name: 'country',
                label: 'Country G4',
                actionType: 'api',
              },
            ],
          },
          {
            component: 'Button',
            buttonText: 'Download Api',
            actionType: 'download-doc',
            url: '/download',
            params: {
              Ok: true,
            },
          },
          {
            component: 'Button',
            buttonText: 'Module Execution',
            actionType: 'module',
            postHook: 'user.addUser',
          },
          {
            component: 'Button',
            buttonText: 'Module With Data Key',
            actionType: 'module',
            postHook: 'user.addUser',
            dataKey: 'test',
          },
          {
            component: 'Button',
            buttonText: 'User store',
            actionType: 'user-store',
            params: {
              save: 'ok',
            },
          },
          {
            component: 'Button',
            buttonText: 'Notify',
            actionType: 'notify-message',
            params: {
              message: 'added success',
            },
          },
          {
            component: 'Button',
            buttonText: 'Popup',
            actionType: 'popup',
            params: {
              message: 'added success',
            },
          },
          {
            component: 'Button',
            buttonText: 'Popup Screen',
            actionType: 'popup-screen',
            params: {
              screenName: '/test/ao',
              data: {},
              showConfirm: false,
            },
          },
          {
            component: 'Button',
            buttonText: 'Redirect',
            actionType: 'redirect',
            to: '/home',
            params: {
              screenId: '2pm',
            },
          },
        ],
      },
    };
    beforeEach(async () => {
      mockProps = {
        location: fake.location.create({
          pathname: '/content/en',
        }),
        commonActions: fake.commonActions.create(),
        contentActions: fake.contentActions.create({
          fetchContentPage: {
            data: pageResponse,
          },
          executeHook: {
            status: 'success',
            data: {
              executionHook: 1,
            },
          },
          postApi: {
            status: 'success',
            data: {
              executionHook: 1,
            },
          },
          checkAndPostApi: {
            status: 'success',
            data: {
              executionHook: 1,
            },
          },
        }),
        store: fake.store.create({
          userData: {},
        }),
      };
      jest.useFakeTimers();
      await act(() => {
        const { container } = render(<DynamicContent {...mockProps} />);
        jest.advanceTimersByTime(2000);
        _container = container;
      });
    });

    test('should call to downloadApi()', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('download_api_button'));
      });
      expect(mockProps.contentActions.downloadApi).toHaveBeenCalledWith(
        {
          component: 'Button',
          buttonText: 'Download Api',
          actionType: 'download-doc',
          url: '/download',
          params: {
            Ok: true,
          },
        },
        pageResponse
      );
    });
    test('should call to postApi()', async () => {
      await act(() => {
        fireEvent.change(screen.getByTestId('country_g4_input'), {
          target: { value: 'India222' },
        });
        jest.advanceTimersByTime(200);

      });
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          cmpType: 'Input',
          label: 'Country G4',
          name: 'country',
          actionType: 'api',
        },
        pageResponse
      );
    });
    test('should call to postApi() with dataKey', async () => {
      await act(() => {
        fireEvent.change(screen.getByTestId('country_g4_input'), {
          target: { value: 'India222' },
        });
        jest.advanceTimersByTime(200);

      });
      expect(mockProps.contentActions.postApi).toHaveBeenCalledWith(
        {
          cmpType: 'Input',
          label: 'Country G4',
          name: 'country',
          actionType: 'api',
        },
        pageResponse
      );
    });
    test('should call to executeHook() for given registerd module', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('module_execution_button'));
      });
      expect(mockProps.contentActions.executeHook).toHaveBeenCalledWith(
        {
          component: 'Button',
          buttonText: 'Module Execution',
          actionType: 'module',
          postHook: 'user.addUser',
        },
        pageResponse
      );
      // expect(mockProps.contentActions.updateUserData).toHaveBeenCalledWith({
      //   executionHook: 1,
      //   lastError: {},
      // });
    });
    test('should call to executeHook() for given registerd module along with dataKey', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('module_with_data_key_button'));
      });
      expect(mockProps.contentActions.executeHook).toHaveBeenCalledWith(
        {
          component: 'Button',
          buttonText: 'Module With Data Key',
          actionType: 'module',
          dataKey: 'test',
          postHook: 'user.addUser',
        },
        pageResponse
      );
      expect(mockProps.contentActions.updateUserData).toHaveBeenCalledWith({
        test: {
          executionHook: 1,
        },
        lastError: {},
      });
    });
    test('should call mergeUserData() to save given data', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('user_store_button'));
      });
      expect(mockProps.contentActions.mergeUserData).toHaveBeenLastCalledWith({
        save: 'ok',
      });
    });
    test('should call showNotificationMessage() to save given data', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('notify_button'));
      });
      expect(
        mockProps.commonActions.showNotificationMessage
      ).toHaveBeenLastCalledWith({
        message: 'added success',
      });
    });
    test('should call showPopup() to save given params', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('popup_button'));
      });
      expect(mockProps.commonActions.showPopup).toHaveBeenLastCalledWith({
        message: 'added success',
      });
    });
    test('should call showPopupScreen() to save given params', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('popup_screen_button'));
      });
      expect(mockProps.commonActions.showPopupScreen).toHaveBeenLastCalledWith({
        screenName: '/test/ao',
        data: {},
        showConfirm: false,
      });
    });
    test('should call redirect() to save given params', async () => {
      await act(() => {
        fireEvent.click(screen.getByTestId('redirect_button'));
      });
      expect(redirectTo).toHaveBeenLastCalledWith(
        '/home',
        {
          screenId: '2pm',
        },
        undefined
      );
    });
  });

  describe('Register Custom Containers', () => {
    test('should be able to register custom container', () => {
      containers.set({
        newCOntainer: () => <div>hello</div>,
      });
    });
  });
});
