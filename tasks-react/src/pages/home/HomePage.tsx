import { Container } from "../../components/Container";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import { GuestUser } from "./GuestUser";
import Menu from "../../components/Menu";
import UserHome from "./UserHome";
import MenuLogged from "../../components/MenuLogged";

const HomePage = () => {
  const { user } = useFirebaseUser();
  return (
    <>
      {user ? <MenuLogged /> : <Menu />}
      <Container>{user ? <UserHome /> : <GuestUser />}</Container>
    </>
  );
};

export default HomePage;
