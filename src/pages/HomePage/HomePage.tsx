import { useEffect } from 'react'
import setLoadingPage from '../../utils/setLoadingPage';

const HomePage = () => {
    useEffect(() => {
        setLoadingPage({ value: 30 });
        setTimeout(() => {
                setLoadingPage({ value: 100 });
        },3000)
       
      }, []);
  return (
    <div>
      ssss
    </div>
  )
}

export default HomePage
