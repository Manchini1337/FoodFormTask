import classes from './Form.module.css';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { FieldName, FormData, FormErrors, ResponseData } from '../../types';

type FormProps = {
  setResponseData: (response: ResponseData) => void;
  setIsLoading: (loading: boolean) => void;
};

const initialFormValue: FormData = {
  [FieldName.Name]: '',
  [FieldName.PreparationTime]: '',
  [FieldName.Type]: '',
};

const Form: React.FC<FormProps> = ({ setResponseData, setIsLoading }) => {
  const [formData, setFormData] = useState<FormData>(initialFormValue);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccessMessageShown, setIsSuccessMessageShown] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://frosty-wood-6558.getsandbox.com:443/dishes',
        formData
      );

      console.log(response);
      setResponseData(response.data);
      setIsSuccessMessageShown(true);
      setFormData(initialFormValue);
    } catch (error) {
      console.dir(error);

      if (axios.isAxiosError<FormErrors>(error)) {
        setErrors(error.response?.data || {});
      }
    }
    setIsLoading(false);
  };

  // Sets form data dynamically, based on current input
  // Clears any errors related to that input (assuming user is trying to fix his mistake)
  // Clears success message (assuming user wants to submit form again)
  const setFieldValue = <T extends FieldName>(
    fieldName: T,
    value: FormData[T]
  ) => {
    setFormData({ ...formData, [fieldName]: value });
    setErrors({ ...errors, [fieldName]: undefined });
    setIsSuccessMessageShown(false);
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <h2 className={classes.title}>Order</h2>

        <div className={classes.formGroup}>
          <label htmlFor="dishname">Dish name</label>
          <div className={classes.inputGroup}>
            <input
              required
              pattern=".{3,}"
              placeholder="Dish name"
              id="dishname"
              name="dishname"
              type="text"
              onChange={(e) => {
                setFieldValue(FieldName.Name, e.target.value);
              }}
              value={formData[FieldName.Name]}
            />
            <i className="bx bxs-pizza" />
          </div>
          <div className={classes.errorMessage}>{errors[FieldName.Name]}</div>
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="preparation">Preparation time</label>
          <div className={classes.inputGroup}>
            <input
              required
              pattern="(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}"
              placeholder="00:00:00"
              id="preparation"
              name="preparation"
              type="text"
              onChange={(e) => {
                setFieldValue(FieldName.PreparationTime, e.target.value);
              }}
              value={formData[FieldName.PreparationTime]}
            />
            <i className="bx bx-time" />
          </div>
          <div className={classes.errorMessage}>
            {errors[FieldName.PreparationTime]}
          </div>
        </div>

        <div className={classes.formGroup}>
          <label htmlFor="dishtype">Dish type</label>
          <div className={classes.inputGroup}>
            <select
              name="dishtype"
              id="dishtype"
              required
              onChange={(e) => {
                if (e.target.value === 'soup') {
                  setFormData({
                    ...formData,
                    [FieldName.SpicinessScale]: 1,
                    [FieldName.NoOfSlices]: undefined,
                    [FieldName.Diameter]: undefined,
                    [FieldName.SlicesOfBread]: undefined,
                    [FieldName.Type]: e.target.value,
                  });
                } else {
                  setFormData({
                    ...formData,
                    [FieldName.SpicinessScale]: undefined,
                    [FieldName.NoOfSlices]: undefined,
                    [FieldName.Diameter]: undefined,
                    [FieldName.SlicesOfBread]: undefined,
                    [FieldName.Type]: e.target.value,
                  });
                }
              }}
              value={formData[FieldName.Type]}
            >
              <option value="" hidden defaultValue="">
                Pick a dish
              </option>
              <option value="pizza">Pizza</option>
              <option value="soup">Soup</option>
              <option value="sandwich">Sandwich</option>
            </select>
            <i className="bx bxs-down-arrow"></i>
          </div>
          <div className={classes.errorMessage}>{errors[FieldName.Type]}</div>
        </div>

        {formData.type === 'pizza' && (
          <>
            <div className={classes.formGroup}>
              <label htmlFor="pizzaSlices">Pizza slices</label>
              <div className={classes.inputGroup}>
                <input
                  required
                  placeholder="8"
                  id="pizzaSlices"
                  name="pizzaSlices"
                  type="number"
                  min={1}
                  step={1}
                  onChange={(e) =>
                    setFieldValue(FieldName.NoOfSlices, +e.target.value)
                  }
                  value={formData[FieldName.NoOfSlices] || ''}
                />
              </div>
              <div className={classes.errorMessage}>
                {errors[FieldName.NoOfSlices]}
              </div>
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="pizzaDiameter">Pizza diameter</label>
              <div className={classes.inputGroup}>
                <input
                  required
                  placeholder="3.14"
                  id="pizzaDiameter"
                  name="pizzaDiameter"
                  type="number"
                  min={0}
                  step="any"
                  onChange={(e) =>
                    setFieldValue(FieldName.Diameter, +e.target.value)
                  }
                  value={formData[FieldName.Diameter] || ''}
                />
              </div>
              <div className={classes.errorMessage}>
                {errors[FieldName.Diameter]}
              </div>
            </div>
          </>
        )}

        {formData.type === 'soup' && (
          <div className={classes.formGroup}>
            <label htmlFor="spiceScale">
              Spiciness scale: {formData[FieldName.SpicinessScale]}
            </label>
            <div className={classes.rangeWrapper}>
              1
              <input
                required
                id="spiceScale"
                name="spiceScale"
                type="range"
                min={1}
                max={10}
                step={1}
                onChange={(e) =>
                  setFieldValue(FieldName.SpicinessScale, +e.target.value)
                }
                value={formData[FieldName.SpicinessScale] || 1}
              />
              10
            </div>
            <div className={classes.errorMessage}>
              {errors[FieldName.SpicinessScale]}
            </div>
          </div>
        )}

        {formData.type === 'sandwich' && (
          <div className={classes.formGroup}>
            <label htmlFor="breadSlices">Bread slices</label>
            <div className={classes.inputGroup}>
              <input
                required
                placeholder="2"
                id="breadSlices"
                name="breadSlices"
                type="number"
                min={1}
                step={1}
                onChange={(e) =>
                  setFieldValue(FieldName.SlicesOfBread, +e.target.value)
                }
                value={formData[FieldName.SlicesOfBread] || ''}
              />
            </div>
            <div className={classes.errorMessage}>
              {errors[FieldName.SlicesOfBread]}
            </div>
          </div>
        )}

        <button className={classes.btn}>Send</button>

        {isSuccessMessageShown && (
          <>
            <p className={classes.successMessage}>Success!</p>
            <p className={classes.successMessage}>
              Check console for more details.
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Form;
