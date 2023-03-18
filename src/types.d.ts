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
    age?: { to?: Number, from?: Number; };
    and?: UserSegment;
    device_type?: Array<device>;
    gender?: gender;
    location?: Array<string>;
    or?: UserSegment;
    signup_date?: { to?: string, from?: string};
    subscription_plan?: Array<subscription>;
    user_id?: Array<Number>;
};

type EventSegment = {
    and?: EventSegment;
    event_name?: Array<string>;
    or?: EventSegment;
    user_id?: Array<Number>;
    timestamp?: {from: Number | string, to: Number | string};
}