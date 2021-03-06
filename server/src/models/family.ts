import { Entity, Column } from "typeorm";
import BaseModel from "./base_model";
import { relationship_types } from "./relationship_types";

export interface FamilyAttributes {
    giver: number;
    receiver: number;
    giver_relationship: relationship_types;
    receiver_relationship: relationship_types;
    confirmed: boolean;
    initiator: number;
}

const EmptyFamilyAttributes = (): FamilyAttributes => ({
    giver: -1,
    receiver: -1,
    giver_relationship: relationship_types.Child,
    receiver_relationship: relationship_types.Parent,
    confirmed: false,
    initiator: -1,
});

export const FamilyBuilder = <T extends Partial<FamilyAttributes>>(
    options?: T
): FamilyAttributes & T => Object.assign(EmptyFamilyAttributes(), options);

@Entity({ name: "family" })
export default class Family extends BaseModel implements FamilyAttributes {
    @Column()
    public giver!: number;
    @Column()
    public receiver!: number;
    @Column()
    public giver_relationship!: relationship_types;
    @Column()
    public receiver_relationship!: relationship_types;
    @Column()
    public confirmed!: boolean;
    @Column()
    public initiator!: number;

    public constructor(options?: Partial<FamilyAttributes>) {
        super();
        const userAttr = FamilyBuilder(options);
        Object.assign(this, userAttr);
    }
}
