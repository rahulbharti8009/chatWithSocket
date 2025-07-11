import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginUI } from '../app/ui/loginUI';
import { ThemeProvider, useTheme } from '../app/theme/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';

test("2 and 5 multiply 10",()=> {
  expect(10).toBe(10)
})

test("Null Value",()=> {
  const value = 12;
  expect(value).not.toBe(10)
  expect(false).toBeFalsy()
  expect(true).toBeTruthy()
})


test.only("Number Comparission",()=> {
 const value = 12;
  expect(value).toBeGreaterThan(10)
  expect(value).toBeGreaterThanOrEqual(12)
  expect(value).toBeLessThan(20)
  expect(value).toBeLessThanOrEqual(12)
})


const mockNavigate = jest.fn();

const mockProps: any = {
  navigation: { 
    navigate: mockNavigate,
  },
};

// describe.only('LoginUI - Mobile Number Input', () => {
//   it('should not allow more than 10 digits', () => {
//     const { getByPlaceholderText } = render(
//       <ThemeProvider>
//         <NavigationContainer>
//           <LoginUI {...mockProps} />
//         </NavigationContainer>
//       </ThemeProvider>
//     );

//     const mobileInput = getByPlaceholderText('Enter Mobile Number');
//     fireEvent.changeText(mobileInput, '123456789012345');
//     expect(mobileInput.props.value.length).toBeLessThanOrEqual(10); // visually enforced
//   });
// });

