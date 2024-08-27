import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { DEFAULT_QUERY_OPTION } from './utils/constants.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: DEFAULT_QUERY_OPTION,
  },
});
root.render(
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        
      </PersistGate>
  </Provider>
)
