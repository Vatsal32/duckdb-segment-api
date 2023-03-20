enum gender {
    Male,
    Female
}

enum subscription {
    basic,
    pro,
    premium,
}

enum device {
    mobile,
    desktop,
    watch,
    tv
}

enum event {
    login,
    signin,
    signout,
    purchase,
    return,
    add_to_cart,
    remove_from_cart
}

type UserSegment = {
    age?: { to?: number, from?: number; };
    and?: UserSegment;
    device_type?: Array<device>;
    gender?: gender;
    location?: Array<string>;
    or?: UserSegment;
    signup_date?: { to?: string, from?: string};
    subscription_plan?: Array<subscription>;
    user_id?: Array<number>;
};

type EventSegment = {
    and?: EventSegment;
    event_name?: Array<string>;
    or?: EventSegment;
    user_id?: Array<number>;
    timestamp?: {from: number | string, to: number | string};
}