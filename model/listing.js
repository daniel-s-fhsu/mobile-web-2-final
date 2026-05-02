class Listing {
  constructor(
    id,
    itemName,
    description,
    price,
    category,
    condition,
    location,
    imageUrl,
    sellerId,
    sellerEmail,
    createdAt
  ) {
    this.id = id;
    this.itemName = itemName;
    this.description = description;
    this.price = price;
    this.category = category;
    this.condition = condition;
    this.location = location;
    this.imageUrl = imageUrl;
    this.sellerId = sellerId;
    this.sellerEmail = sellerEmail;
    this.createdAt = createdAt;
  }
}

export default Listing;
