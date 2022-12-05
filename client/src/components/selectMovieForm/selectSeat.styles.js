import styled from 'styled-components';

export const Screen = styled.div`
    width: 100%;
    height: 70px;
    background-color: #fff;
    margin: 20px 0;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.7);
    text-align: center;
`

export const Seat = styled.div`
    width: 20px;
    height: 20px;
    margin: 20px;
    border: 20px solid #969696;

`
export const SeatsContainer = styled.div`
    display: flex;                  
    flex-direction: row;           
    flex-wrap: nowrap;             
    justify-content: space-between; 
`

export const SeatsContainerBC = styled.div`
    display: flex;                  
    flex-direction: row;           
    flex-wrap: nowrap;             
`

export const Container = styled.div`
    margin-top: 10vh;
    margin-left: 20%;
    margin-right: 20%;
`;