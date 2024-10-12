export type User = {
    name: string;
    email: string;
    phone: string;
    isSeller: boolean;
    shoeSize: number;
    sellerVerification: 'pending' | 'verified' | 'rejected' | 'N/A';
    createdAt: Date;
    profilePicture?: string;
    shippingInfo?: {
        basicAddress: string;
        Area: string;
        Landmark: string;
        pinCode: string;
        city: string;
        state: 
        "Andhra Pradesh"
        | "Arunachal Pradesh"
        | "Assam"
        | "Bihar"
        | "Chhattisgarh"
        | "Goa"
        | "Gujarat"
        | "Haryana"
        | "Himachal Pradesh"
        | "Jharkhand"
        | "Karnataka"
        | "Kerala"
        | "Madhya Pradesh"
        | "Maharashtra"
        | "Manipur"
        | "Meghalaya"
        | "Mizoram"
        | "Nagaland"
        | "Odisha"
        | "Punjab"
        | "Rajasthan"
        | "Sikkim"
        | "Tamil Nadu"
        | "Telangana"
        | "Tripura"
        | "Uttar Pradesh"
        | "Uttarakhand"
        | "West Bengal"
        | "Andaman and Nicobar Islands"
        | "Chandigarh"
        | "Dadra and Nagar Haveli and Daman and Diu"
        | "Delhi"
        | "Puducherry"
        | "Ladakh"
        | "Jammu and Kashmir";
        };
};

export type Sneaker = {
    name: string;
    type: string;
    description: string;
    openingBid: number;
    imageUrls: {frontView: string, backView: string, sideView: string, topDownView: string, outSoleView: string};
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