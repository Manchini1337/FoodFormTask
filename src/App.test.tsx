import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

const SELECTORS = {
  dishNameLabel: 'Dish name',
  preparationTimeLabel: 'Preparation time',
  dishTypeRole: 'combobox',
  pizzaSlicesLabel: 'Pizza slices',
  pizzaDiameterLabel: 'Pizza diameter',
  sendButton: 'Send',
  breadSlicesLabel: 'Bread slices',
};

jest.mock('axios', () => ({
  default: {},
}));

describe('<Form /> and <Card /> integration tests', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('should display response data in <Card /> component upon correct <Form /> submittion', async () => {
    //given
    const formData = {
      name: 'some name',
      preparation_time: '12:12:12',
      diameter: '3.14',
      no_of_slices: '5',
      type: 'pizza',
    };

    const responseData = {
      name: 'some name',
      preparation_time: '12:12:12',
      type: 'pizza',
      no_of_slices: 5,
      diameter: 3.14,
      id: 1,
    };

    axios.post = jest.fn().mockResolvedValueOnce({
      data: responseData,
      status: 200,
    });

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
    expect(screen.getByText(responseData.name)).toBeVisible();
    expect(screen.getByText(responseData.preparation_time)).toBeVisible();
    expect(screen.getByText(responseData.type)).toBeVisible();
    expect(screen.getByText(responseData.no_of_slices)).toBeVisible();
    expect(screen.getByText(responseData.diameter)).toBeVisible();
    expect(screen.getByText(responseData.id)).toBeVisible();
  });
});
