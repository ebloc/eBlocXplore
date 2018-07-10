import React from 'react';

function addressClicked(address) {
  console.log('address clicked: ', address);
}

exports.addressLink = (address) => {
  return (
    <a href="#" onClick={addressClicked}>{address.slice(0,20)}...</a>
  )
}