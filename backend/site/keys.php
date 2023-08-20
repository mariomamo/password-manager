<?php
  $keyPair = openssl_pkey_new(array(
    "digest_alg" => 'sha512',
    "private_key_bits" => 4096,
    "private_key_type" => OPENSSL_KEYTYPE_RSA
  ));
  $public_key_pem = openssl_pkey_get_details($keyPair)['key'];
  echo $public_key_pem . "<br>";
  openssl_pkey_export($keyPair, $privateKey);
  echo $privateKey . "<br>";
  $public_key = openssl_pkey_get_public($public_key_pem);
  var_dump($public_key);
?>