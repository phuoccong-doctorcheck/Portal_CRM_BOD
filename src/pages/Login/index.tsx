import "./index.scss"
import Typography from '../../components/common/Typography';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Image from '../../components/common/Image';
import Container from '../../components/Container';
import logo from "../../assets/images/dtc_shot_logo.png"
const Login = () => {
  return (
    <div className="p-anthentication">
      <Container modifiers={['formLogin']}>
          <Image src={logo} ratio="300x100" size="contain" />
          <div className="t-loginaccount">
    <form>
      <Input
        id="user_name"
        placeholder="Tài khoản đăng nhập"
        label="Tên đăng nhập"
        autoFocus
        // onChange={(e) => {
        //   setDataLogin({ ...dataLogin, username: e.target.value });
        //   setError({ ...error, username: '' });
        // }}
        // error={error.username}
        // handleEnter={onSubmit}
        variant="simple"
       // value={dataLogin.username}
      />

      <Input
        id="_password"
        placeholder="Mật khẩu"
        label="Mật khẩu"
        type="password"
        isPassword
        // onChange={(e) => {
        //   setDataLogin({ ...dataLogin, password: e.target.value });
        //   setError({ ...error, password: '' });
        // }}
        // error={error.password}
        // handleEnter={onSubmit}
        variant="simple"
     //   value={dataLogin.password}
      />
      <div className="t-loginaccount_btn">
        <Button modifiers={['foreign']} isLoading={false} disabled={false} >
          <Typography
            content="đăng nhập"
            modifiers={['500', '18x32', 'capitalize', 'white']}
          />
        </Button>
      </div>
    </form>
          </div>
      </Container>
    </div>
  )
}

export default Login
