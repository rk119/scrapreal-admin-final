import { Button, chakra, extendTheme, Input } from '@chakra-ui/react';
import { Poppins } from '@next/font/google';

const poppins = Poppins({
  weight: '500',
  preload: false,
  subsets: ['latin']
});

export const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        color: 'accent_blue',
        backgroundColor: 'accent_white'
      }
    }
  },
  colors: {
    accent_blue: '#101634',
    accent_turquoise: '#7CE6E8',
    accent_turquoise_dark: '#70cfd1',
    accent_purple: '#918EF4',
    accent_white: '#fbfcfa',
    accent_white_dark: '#fffefc',
    accent_red: '#BC2D21'
  },
  fonts: {
    body: poppins.style.fontFamily,
    heading: poppins.style.fontFamily
  }
});

export const InputField = chakra(Input, {
  baseStyle: {
    bgColor: 'accent_white',
    borderColor: 'accent_blue'
  }
});

export const WebButton = chakra(Button, {
  baseStyle: {
    width: '50%',
    bgColor: 'accent_turquoise',
    color: 'accent_blue',
    rounded: 'full',
    _hover: {
      bgColor: 'accent_turquoise_dark'
    },
    _loading: {
      _hover: {
        bgColor: 'accent_turquoise'
      }
    }
  }
});
