import { useState } from 'react';
import styled from 'styled-components';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Container onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="방 제목으로 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchButton type="submit">검색</SearchButton>
    </Container>
  );
};

const Container = styled.form`  // div에서 form으로 변경
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 5px;
  border-radius: 5px;
`;

const SearchButton = styled.button`
  padding: 5px 15px;
  background: #90EE90;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #98FB98;
  }
`;

export default SearchBar;