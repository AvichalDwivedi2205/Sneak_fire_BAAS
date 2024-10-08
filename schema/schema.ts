export type User = {
    name: string;
    email: string;
    phone: string;
    isSeller: boolean;
    sellerVerification: 'pending' | 'verified' | 'rejected';
    createdAt: Date;
    profilePicture?: string;
};

export type Sneaker = {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    sellerId: string;
    status: 'open' | 'closed';
    topBids: {userId: string, amount: number}[];
};

export type Bid = {
    userId : string;
    sneakerId :string;
    bidAmount : number;
    timestamp : number;
}