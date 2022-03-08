import { useState } from "react"
import {Button} from "../../Header/Buttons/Button"
import Body from "../../Body/Body"
import styled from "styled-components/macro"

const TriggerCover = styled.div`
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    border: none;
    text-align: left;
    margin: 0 0 0 20px;
`

const Trigger = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: none;
    margin: 0px;
    padding: 0px;
    height: 35px;
    width: 100px;
    background-color: rgb(0, 64, 120);
    box-shadow: rgb(0 0 0 / 17%) 0px 0px 10px 0px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.5s ease 0s;
`

const Menu = () => {

    const [show, setShow] = useState(false)

    return (
        <TriggerCover>
            <Trigger>
                <Button
                    onClick={() => setShow(!show)}
                >
                    View Account
                </Button>
                {show && <Body />}
            </Trigger>
        </TriggerCover>
    )
}

export default Menu