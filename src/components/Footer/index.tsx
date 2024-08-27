import  { useState } from 'react'
import { Link } from 'react-router-dom'
import mapModifiers from '../../utils/functions'
import Typography from '../common/Typography';


type TypeConnectSK = 'connected' | 'disconnect';
const Footer = () => {
  const [stateConnect,] = useState<TypeConnectSK>('connected')
  return (
    <div style={{ textAlign: 'center', position:"fixed", bottom:0 , background:"#ffffff",width:"100%", height:"25px", display:"flex", alignItems:"center", justifyContent:"space-between",paddingLeft:"10px",paddingRight:"10px"}}>
       <div className={mapModifiers("p-monitor_state", stateConnect)}>
        <span></span>
        <Typography content={stateConnect === 'connected' ? 'Đã kết nối' : 'Mất kết nối'} />
      </div>
      <div style={{fontSize:"11px"}}> <span style={{fontWeight:500}}> Copyright ©{new Date().getFullYear()} <Link target="_blank" to='https://www.doctorcheck.vn/' style={{color:"007bff"}}>Doctor Check</Link>.</span> All rights reserved</div> 
    </div>
  )
}

export default Footer
