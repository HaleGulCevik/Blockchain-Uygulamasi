
pragma solidity ^0.8.0;

contract VeriKayit {
    string public kayitliVeri;

  
    function veriEkle(string memory _yeniVeri) public {
        kayitliVeri = _yeniVeri;
    }
}