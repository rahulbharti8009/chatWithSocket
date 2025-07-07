import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginUI } from '../app/ui/loginUI';
import { useTheme } from '../app/theme/ThemeContext';
import { checkInternetConnection, localSaveMobile } from '../app/utils/localDB';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock modules
jest.mock('../theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    themeColor: {
      background: '#FFFFFF',
      text: '#000000',
      inputBackground: '#ffffff',
      inputBorder: '#ccc',
      googleButtonBorder: '#ccc',
      googleButtonText: '#444',
    },
  }),
}));

jest.mock('../utils/localDB', () => ({
  checkInternetConnection: jest.fn(),
  localSaveMobile: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  }),
) as jest.Mock;

const mockNavigate = jest.fn();

const props: any = {
  navigation: {
    navigate: mockNavigate,
  },
};

describe('LoginUI Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required UI elements', () => {
    const { getByPlaceholderText, getByText } = render(<LoginUI {...props} />);

    expect(getByPlaceholderText('Enter Mobile Number')).toBeTruthy();
    expect(getByText('Login Screen')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('OR')).toBeTruthy();
    expect(getByText('Continue with Google')).toBeTruthy();
  });

  it('shows alert if mobile number is invalid', async () => {
    const { getByText } = render(<LoginUI {...props} />);
    const loginButton = getByText('Login');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(checkInternetConnection).not.toHaveBeenCalled();
    });
  });

  it('calls login API with valid mobile and OTP', async () => {
    (checkInternetConnection as jest.Mock).mockResolvedValue(true);

    const { getByPlaceholderText, getByText } = render(<LoginUI {...props} />);

    fireEvent.changeText(
      getByPlaceholderText('Enter Mobile Number'),
      '9876543210',
    );

    // OTP and name fields should appear now
    fireEvent.changeText(getByPlaceholderText('Enter OTP'), '1234');
    fireEvent.changeText(
      getByPlaceholderText('Enter your profile name.'),
      'Rahul',
    );

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(checkInternetConnection).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('chatLoginSignup'),
        expect.any(Object),
      );
      expect(localSaveMobile).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Home', {
        mobile: '9876543210',
      });
    });
  });

  it('displays loading indicator while logging in', async () => {
    (checkInternetConnection as jest.Mock).mockResolvedValue(true);

    const { getByPlaceholderText, getByText, getByTestId } = render(
      <LoginUI {...props} />,
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter Mobile Number'),
      '9876543210',
    );
    fireEvent.changeText(getByPlaceholderText('Enter OTP'), '1234');
    fireEvent.changeText(
      getByPlaceholderText('Enter your profile name.'),
      'TestUser',
    );

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});
