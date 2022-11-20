import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { FormData } from '../../types';
import Form from './Form';

const mockedSetResponseData = jest.fn();
const mockedSetIsLoading = jest.fn();

jest.mock('axios', () => ({
  default: {
    isAxiosError: () => true,
  },
}));

const SELECTORS = {
  dishNameLabel: 'Dish name',
  preparationTimeLabel: 'Preparation time',
  dishTypeRole: 'combobox',
  pizzaSlicesLabel: 'Pizza slices',
  pizzaDiameterLabel: 'Pizza diameter',
  sendButton: 'Send',
  breadSlicesLabel: 'Bread slices',
};

describe('<Form />', () => {
  //rendering <Form /> component before each test
  beforeEach(() => {
    render(
      <Form
        setIsLoading={mockedSetIsLoading}
        setResponseData={mockedSetResponseData}
      />
    );
  });

  describe('Dish name input', () => {
    it('should be able to type into dish name input', () => {
      //when
      const inputElement = screen.getByLabelText<HTMLInputElement>(
        SELECTORS.dishNameLabel
      );

      //given
      fireEvent.change(inputElement, {
        target: { value: 'Pizza capricciosa' },
      });

      //then
      expect(inputElement.value).toBe('Pizza capricciosa');
    });

    it('should render invalid input when dish name is less than 3 characters', () => {
      //when
      const inputElement = screen.getByLabelText(SELECTORS.dishNameLabel);

      //given
      fireEvent.change(inputElement, {
        target: { value: 'as' },
      });

      //then
      expect(inputElement).toBeInvalid();
    });
  });

  describe('Preparation time input', () => {
    it('should be able to type into preparation time input', () => {
      //when
      const inputElement = screen.getByLabelText<HTMLInputElement>(
        SELECTORS.preparationTimeLabel
      );

      //given
      fireEvent.change(inputElement, {
        target: { value: '11:22:33' },
      });

      //then
      expect(inputElement.value).toBe('11:22:33');
    });

    it('should render invalid input when given value that doesnt follow 24H clock format', () => {
      //given
      const inputElement = screen.getByLabelText(
        SELECTORS.preparationTimeLabel
      );

      //when
      fireEvent.change(inputElement, {
        target: { value: 'asa123sd' },
      });

      //then
      expect(inputElement).toBeInvalid();
    });
  });

  describe('Dish type select input', () => {
    it('should render the correct number of options (three)', () => {
      //given
      const options = screen.getAllByRole('option');

      //then
      expect(options.length).toBe(3);
    });

    it('should be able to change dish type', async () => {
      //when
      await userEvent.selectOptions(
        screen.getByRole(SELECTORS.dishTypeRole),
        'Pizza'
      );

      //then
      const optionElement = screen.getByRole<HTMLOptionElement>('option', {
        name: 'Pizza',
      }).selected;

      expect(optionElement).toBe(true);
    });
  });

  describe('Dish type "pizza" is selected', () => {
    // selecting dish type "pizza" before each test
    beforeEach(async () => {
      await userEvent.selectOptions(
        screen.getByRole(SELECTORS.dishTypeRole),
        'Pizza'
      );
    });

    it('should render pizza related inputs (slices and diameter)', () => {
      //given
      const slicesElement = screen.getByLabelText(SELECTORS.pizzaSlicesLabel);
      const diameterElement = screen.getByLabelText(
        SELECTORS.pizzaDiameterLabel
      );

      //then
      expect(slicesElement).toBeInTheDocument();
      expect(diameterElement).toBeInTheDocument();
    });

    it('should be able to change amount of pizza slices', () => {
      //given
      const inputElement = screen.getByLabelText<HTMLInputElement>(
        SELECTORS.pizzaSlicesLabel
      );

      //when
      fireEvent.change(inputElement, { target: { value: '5' } });

      //then
      expect(inputElement.value).toBe('5');
    });

    it('should be able to change pizza diameter', () => {
      //given
      const inputElement = screen.getByLabelText<HTMLInputElement>(
        SELECTORS.pizzaDiameterLabel
      );

      //when
      fireEvent.change(inputElement, { target: { value: '50' } });

      //then
      expect(inputElement.value).toBe('50');
    });

    it('should accept only integer values into pizza slices input', () => {
      //given
      const inputElement = screen.getByLabelText(SELECTORS.pizzaSlicesLabel);

      //when
      fireEvent.change(inputElement, { target: { value: '3.14' } });

      //then
      expect(inputElement).toBeInvalid();
    });

    it('should accept only float values into pizza diameter input', () => {
      //given
      const inputElement = screen.getByLabelText(SELECTORS.pizzaDiameterLabel);

      //when
      fireEvent.change(inputElement, { target: { value: 'asdf' } });

      //then
      expect(inputElement).toBeInvalid();
    });
  });

  describe('Dish type "soup" is selected', () => {
    // selecting dish type "soup" before each test
    beforeEach(async () => {
      await userEvent.selectOptions(
        screen.getByRole(SELECTORS.dishTypeRole),
        'Soup'
      );
    });

    it('should render soup related inputs (spiceness scale)', () => {
      //given
      const inputElement = screen.getByRole('slider');

      //then
      expect(inputElement).toBeInTheDocument();
    });

    it('should change value when input is dragged', () => {
      //given
      const inputElement = screen.getByRole<HTMLInputElement>('slider');

      //when
      fireEvent.change(inputElement, { target: { value: '6' } });

      //then
      expect(inputElement.value).toBe('6');
    });
  });

  describe('Dish type "sandwich" is selected', () => {
    // selecting dish type "sandwich" before each test
    beforeEach(async () => {
      await userEvent.selectOptions(
        screen.getByRole(SELECTORS.dishTypeRole),
        'Sandwich'
      );
    });

    it('should render sandwich related inputs (bread slices)', () => {
      //given
      const inputElement = screen.getByLabelText(SELECTORS.breadSlicesLabel);

      //then
      expect(inputElement).toBeInTheDocument();
    });

    it('should be able to change amount of bread slices', () => {
      //given
      const inputElement = screen.getByLabelText<HTMLInputElement>(
        SELECTORS.breadSlicesLabel
      );

      //when
      fireEvent.change(inputElement, { target: { value: '5' } });

      //then
      expect(inputElement.value).toBe('5');
    });

    it('should accept only integer values into bread slices input', () => {
      //given
      const inputElement = screen.getByLabelText(SELECTORS.breadSlicesLabel);

      //when
      fireEvent.change(inputElement, { target: { value: '3.14' } });

      //then
      expect(inputElement).toBeInvalid();
    });
  });

  describe('Switching dish type during form completion', () => {
    it('should render pizza related inputs, then should switch to soup related input', async () => {
      await userEvent.selectOptions(
        screen.getByRole(SELECTORS.dishTypeRole),
        'Pizza'
      );
      const pizzaSlicesElement = screen.getByLabelText(
        SELECTORS.pizzaSlicesLabel
      );
      const pizzaDiameterElement = screen.getByLabelText(
        SELECTORS.pizzaDiameterLabel
      );

      expect(pizzaSlicesElement).toBeInTheDocument();
      expect(pizzaDiameterElement).toBeInTheDocument();

      // switching from dish type pizza to dish type soup
      await userEvent.selectOptions(
        screen.getByRole(SELECTORS.dishTypeRole),
        'Soup'
      );
      const spicenessScaleElement = screen.getByRole('slider');

      // expecting pizza related inputs to be replaced with soup related input
      expect(pizzaSlicesElement).not.toBeInTheDocument();
      expect(pizzaDiameterElement).not.toBeInTheDocument();
      expect(spicenessScaleElement).toBeInTheDocument();
    });
  });

  describe('Making POST request with data', () => {
    it('should make request with provided data on form submit', async () => {
      //given
      const formData = {
        name: 'some name',
        preparation_time: '12:12:12',
        diameter: '3.14',
        no_of_slices: '5',
        type: 'pizza',
      };

      axios.post = jest.fn();

      //when
      await userEvent.type(
        screen.getByLabelText(SELECTORS.dishNameLabel),
        formData.name
      );
      await userEvent.type(
        screen.getByLabelText(SELECTORS.preparationTimeLabel),
        formData.preparation_time
      );
      await userEvent.selectOptions(
        screen.getByRole(SELECTORS.dishTypeRole),
        formData.type
      );
      await userEvent.type(
        screen.getByLabelText(SELECTORS.pizzaSlicesLabel),
        formData.no_of_slices
      );
      await userEvent.type(
        screen.getByLabelText(SELECTORS.pizzaDiameterLabel),
        formData.diameter
      );
      await userEvent.click(screen.getByText(SELECTORS.sendButton));

      //then
      expect(axios.post).toBeCalledWith(
        'https://frosty-wood-6558.getsandbox.com:443/dishes',
        {
          name: formData.name,
          preparation_time: formData.preparation_time,
          diameter: Number(formData.diameter),
          no_of_slices: Number(formData.no_of_slices),
          type: formData.type,
          slices_of_bread: undefined,
          spiciness_scale: undefined,
        } as FormData
      );
    });

    it('should display errors', async () => {
      //given
      const formData = {
        name: 'some name',
        preparation_time: '12:12:12',
        diameter: '3.14',
        no_of_slices: '5',
        type: 'pizza',
      };

      const errors = {
        name: 'invalid name error',
      };

      axios.post = jest.fn().mockRejectedValueOnce({
        response: { data: errors },
      });

      //when
      await userEvent.type(
        screen.getByPlaceholderText(SELECTORS.dishNameLabel),
        formData.name
      );
      await userEvent.type(
        screen.getByLabelText(SELECTORS.preparationTimeLabel),
        formData.preparation_time
      );
      await userEvent.selectOptions(
        screen.getByRole(SELECTORS.dishTypeRole),
        formData.type
      );
      await userEvent.type(
        screen.getByLabelText(SELECTORS.pizzaSlicesLabel),
        formData.no_of_slices
      );
      await userEvent.type(
        screen.getByLabelText(SELECTORS.pizzaDiameterLabel),
        formData.diameter
      );
      await userEvent.click(screen.getByText(SELECTORS.sendButton));

      //then
      expect(screen.getByText(errors.name)).toBeVisible();
    });
  });
});
