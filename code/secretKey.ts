
const express = require('express');
const jwt = require('jsonwebtoken');

const cryp = require('crypto');

const generateSecretKey = () => {
  const secretKey = cryp.randomBytes(32).toString('hex'); // 256 bits (32 bytes)
  return secretKey;
};


const secretKey = generateSecretKey();

module.exports=secretKey; 