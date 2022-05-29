const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('EscrowAgency', function () {
  let escrowAgency;
  let agent, buyer, seller;

  const buyerName1 = 'John';
  const buyerEmail1 = 'john@gmail.com';
  const buyerName2 = 'Mark';
  const buyerEmail2 = 'mark@gmail.com';

  const sellerName1 = 'Mike';
  const sellerEmail1 = 'mike@gmail.com';
  const sellerName2 = 'Andrew';
  const sellerEmail2 = 'andrew@gmail.com';

  const initiateEscrow = async () => {
    await escrowAgency.connect(buyer).registerBuyer(buyerName1, buyerEmail1);
    await escrowAgency
      .connect(seller)
      .registerSeller(sellerName1, sellerEmail1);
    await escrowAgency
      .connect(buyer)
      .initiateEscrow(seller.address, 111, { value: 100 });
  };

  beforeEach(async function () {
    [agent, buyer, seller, account3, account4, account5] =
      await ethers.getSigners();

    const EscrowAgency = await ethers.getContractFactory('EscrowAgency');

    escrowAgency = await EscrowAgency.deploy();
    await escrowAgency.deployed();
  });

  it('should register buyer', async () => {
    await escrowAgency.connect(buyer).registerBuyer(buyerName1, buyerEmail1);

    expect(await escrowAgency.buyersCount()).to.equal(1);

    const buyerDetails = await escrowAgency.getBuyerDetails(buyer.address);

    expect(buyerDetails.name).to.equal(buyerName1);
    expect(buyerDetails.email).to.equal(buyerEmail1);
  });

  it('should register seller', async () => {
    await escrowAgency
      .connect(seller)
      .registerSeller(sellerName1, sellerEmail1);

    expect(await escrowAgency.sellersCount()).to.equal(1);

    const sellerDetails = await escrowAgency.getSellerDetails(seller.address);

    expect(sellerDetails.name).to.equal(sellerName1);
    expect(sellerDetails.email).to.equal(sellerEmail1);
  });

  it('should get all sellers', async () => {
    await escrowAgency
      .connect(account3)
      .registerSeller(sellerName1, sellerEmail1);
    await escrowAgency
      .connect(account4)
      .registerSeller(sellerName2, sellerEmail2);

    expect(await escrowAgency.sellersCount()).to.equal(2);

    const sellers = await escrowAgency.getAllSellers();

    expect(sellers[0].name).to.equal(sellerName1);
    expect(sellers[0].email).to.equal(sellerEmail1);

    expect(sellers[1].name).to.equal(sellerName2);
    expect(sellers[1].email).to.equal(sellerEmail2);
  });

  it('should initiate escrow', async () => {
    await initiateEscrow();

    const escrowDetails = await escrowAgency.getEscrowsBySeller(seller.address);

    expect(escrowDetails[0].id).to.equal(0);
    expect(escrowDetails[0].expiryTime).to.equal(111);
    expect(escrowDetails[0].status).to.equal(0);
    expect(escrowDetails[0].value).to.equal(97);
  });

  it('should deduct correctly the commission', async () => {
    await initiateEscrow();

    const escrowDetails = await escrowAgency.connect(buyer).getEscrowById(0);

    expect(escrowDetails.value).to.equal(97);
  });

  it('should be able to change the commission', async () => {
    let commission = await escrowAgency.commission();
    expect(commission).to.equal(3);

    await escrowAgency.connect(agent).setCommission(5);

    commission = await escrowAgency.commission();

    expect(commission).to.equal(5);
  });

  it('should buyer withdraw the escrow value', async () => {
    let contractBalance = await ethers.provider.getBalance(
      escrowAgency.address
    );

    expect(contractBalance).to.equal(0);

    await initiateEscrow();

    contractBalance = await ethers.provider.getBalance(escrowAgency.address);

    expect(contractBalance).to.equal(100);

    await escrowAgency.connect(buyer).buyerWithdraw(0);

    contractBalance = await ethers.provider.getBalance(escrowAgency.address);
    expect(contractBalance).to.equal(3);
  });

  it('should seller withdraw the escrow value', async () => {
    let contractBalance = await ethers.provider.getBalance(
      escrowAgency.address
    );

    expect(contractBalance).to.equal(0);

    await initiateEscrow();

    contractBalance = await ethers.provider.getBalance(escrowAgency.address);

    expect(contractBalance).to.equal(100);

    await escrowAgency.connect(buyer).confirmDelivery(0);

    await escrowAgency.connect(seller).sellerWithdraw(0);

    contractBalance = await ethers.provider.getBalance(escrowAgency.address);
    expect(contractBalance).to.equal(3);
  });

  it('should get escrow by id', async () => {
    await initiateEscrow();

    const escrowDetails = await escrowAgency.connect(buyer).getEscrowById(0);

    expect(escrowDetails.id).to.equal(0);
    expect(escrowDetails.expiryTime).to.equal(111);
    expect(escrowDetails.status).to.equal(0);
  });

  it('should REVERT if the requester of escrow by id is not a buyer / seller / agent of the respective escrow', async () => {
    await initiateEscrow();

    await expect(
      escrowAgency.connect(account3).getEscrowById(0)
    ).to.be.revertedWith('No right to view this document');
  });

  it('should confirm delivery', async () => {
    await initiateEscrow();

    let escrowDetails = await escrowAgency.getEscrowsBySeller(seller.address);

    expect(escrowDetails[0].status).to.equal(0);

    await escrowAgency.connect(buyer).confirmDelivery(0);

    escrowDetails = await escrowAgency.getEscrowsBySeller(seller.address);

    expect(escrowDetails[0].status).to.equal(2);
  });
});
