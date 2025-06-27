import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModal,
  createOrder,
  selectConstructorBun,
  selectConstructorIngredients,
  selectOrderRequest,
  selectOrderModalData,
  selectConstructorError
} from './burgerConstructorSlice';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../utils/burger-api';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

jest.mock('../utils/burger-api');

const bun: TIngredient = {
  _id: 'bun1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 50,
  image: '',
  image_mobile: '',
  image_large: ''
};

const ingredient: TIngredient = {
  _id: 'ing1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 30,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockOrder: TOrder = {
  _id: 'ord1',
  status: 'finished',
  name: 'Test Order',
  createdAt: '',
  updatedAt: '',
  number: 1234,
  ingredients: [],
};

describe('burgerConstructorSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });

  it('should handle addIngredient (bun)', () => {
    const state = reducer(undefined, addIngredient(bun));
    expect(state.bun).toEqual({ ...bun, id: 'test-uuid' });
    expect(state.ingredients).toEqual([]);
  });

  it('should handle addIngredient (non-bun)', () => {
    const state = reducer(undefined, addIngredient(ingredient));
    expect(state.ingredients).toEqual([{ ...ingredient, id: 'test-uuid' }]);
  });

  it('should handle removeIngredient', () => {
    const initialState = {
      bun: null,
      ingredients: [{ ...ingredient, id: 'test-uuid' }],
      orderRequest: false,
      orderModalData: null,
      error: null
    };
    const state = reducer(initialState, removeIngredient(0));
    expect(state.ingredients).toEqual([]);
  });

  it('should handle moveIngredient', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...ingredient, id: '1' },
        { ...ingredient, id: '2' }
      ],
      orderRequest: false,
      orderModalData: null,
      error: null
    };
    const state = reducer(initialState, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(state.ingredients.map(i => i.id)).toEqual(['2', '1']);
  });

  it('should handle clearConstructor', () => {
    const initialState = {
      bun: { ...bun, id: 'test-uuid' },
      ingredients: [{ ...ingredient, id: 'test-uuid' }],
      orderRequest: false,
      orderModalData: null,
      error: null
    };
    const state = reducer(initialState, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('should handle clearOrderModal', () => {
    const initialState = {
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: mockOrder,
      error: 'Some error'
    };
    const state = reducer(initialState, clearOrderModal());
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });


  describe('createOrder thunk', () => {
    const getState = () => ({
        burgerConstructor: {
            bun,
            ingredients: [{ ...ingredient, id: 'test-uuid' }],
            orderRequest: false,
            orderModalData: null,
            error: null
        },
        ingredients: {} as any,
        feeds: {} as any,
        orderDetails: {} as any,
        user: {} as any,
        userOrders: {} as any
        });

    it('should handle fulfilled', async () => {
      (api.orderBurgerApi as jest.Mock).mockResolvedValue({ order: mockOrder });
      const dispatch = jest.fn();
      const result = await createOrder()(dispatch, getState, undefined);
      expect(result.payload).toEqual(mockOrder);
    });

    it('should handle rejected when no bun', async () => {
      const getState = () => ({
        burgerConstructor: {
            bun: null,
            ingredients: [{ ...ingredient, id: 'test-uuid' }],
            orderRequest: false,
            orderModalData: null,
            error: null
        },
        ingredients: {} as any,
        feeds: {} as any,
        orderDetails: {} as any,
        user: {} as any,
        userOrders: {} as any
        });
      const dispatch = jest.fn();
      const result = await createOrder()(dispatch, getState, undefined);
      expect(result.payload).toEqual('Булка не выбрана');
    });

    it('should handle rejected when no ingredients', async () => {
      const getState = () => ({
        burgerConstructor: {
            bun,
            ingredients: [],
            orderRequest: false,
            orderModalData: null,
            error: null
        },
        ingredients: {} as any,
        feeds: {} as any,
        orderDetails: {} as any,
        user: {} as any,
        userOrders: {} as any
        });
      const dispatch = jest.fn();
      const result = await createOrder()(dispatch, getState, undefined);
      expect(result.payload).toEqual('Нет ингредиентов');
    });

    it('should handle rejected on API error', async () => {
      (api.orderBurgerApi as jest.Mock).mockRejectedValue(new Error('API error'));
      const dispatch = jest.fn();
      const result = await createOrder()(dispatch, getState, undefined);
      expect(result.payload).toEqual('API error');
    });
  });

  describe('selectors', () => {
    const mockState: any = {
      burgerConstructor: {
        bun,
        ingredients: [{ ...ingredient, id: 'test-uuid' }],
        orderRequest: true,
        orderModalData: mockOrder,
        error: 'Error'
      }
    };

    it('selectConstructorBun', () => {
      expect(selectConstructorBun(mockState)).toEqual(bun);
    });

    it('selectConstructorIngredients', () => {
      expect(selectConstructorIngredients(mockState)).toEqual([{ ...ingredient, id: 'test-uuid' }]);
    });

    it('selectOrderRequest', () => {
      expect(selectOrderRequest(mockState)).toBe(true);
    });

    it('selectOrderModalData', () => {
      expect(selectOrderModalData(mockState)).toEqual(mockOrder);
    });

    it('selectConstructorError', () => {
      expect(selectConstructorError(mockState)).toBe('Error');
    });
  });
});
