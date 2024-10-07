// plugins/vuetify.js
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using MDI icons or any other icon set
import 'vuetify/styles'; // Ensure Vuetify styles are imported

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // Ensure 'mdi' is used if using Material Design Icons
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#4700CF',
          // ... other colors
        }
      },
      light: {
        dark: false,
        colors: {
          primary: '#4700CF',
          // ... other colors
        }
      }
    }
  }
});

