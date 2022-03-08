import styled  from "styled-components/macro"
import AccountDetails from "../AccountDetails"

const HeaderCover = styled.div`
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    -webkit-box-pack: justify;
    justify-content: space-between;
    position: fixed;
    top: 0px;
    z-index: 2;
`

const HeaderContent = styled.header`
    display: flex;
    -webkit-box-pack: justify;
    justify-content: flex-end;
    -webkit-box-align: center;
    align-items: center;
    flex-direction: row;
    width: 100%;
    top: 0px;
    padding: 1rem 3rem;
    z-index: 21;
    position: relative;
    background-image: linear-gradient(transparent 50%, rgba(0, 21, 37, 0.5) 50%);
    background-position: 0px 0px;
    background-size: 100% 200%;
    box-shadow: transparent 0px 0px 0px 1px;
    transition: background-position 0.1s ease 0s, box-shadow 0.1s ease 0s, top 0.3s ease 0s;
    background-blend-mode: hard-light;
`

const Header = () => {
    return (
        <HeaderCover>
            <HeaderContent>
                <AccountDetails></AccountDetails>
            </HeaderContent>
        </HeaderCover>
    )
}

export default Header