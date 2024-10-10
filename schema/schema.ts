export type User = {
    name: string;
    email: string;
    phone: string;
    isSeller: boolean;
    shoeSize: number;
    sellerVerification: 'pending' | 'verified' | 'rejected' | 'N/A';
    createdAt: Date;
    profilePicture?: string;
};

export type Sneaker = {
    name: string;
    description: string;
    openingBid: number;
    imageUrl: string;
    sellerId: string;
    sizesAvailable: number[];
    status: 'open' | 'closed';
    topBids: {userId: string, amount: number}[];
};

export type Bid = {
    userId : string;
    sneakerId :string;
    bidAmount : number;
    timestamp : number;
}