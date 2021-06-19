import { Entity, Column } from "typeorm";
import BaseModel from "./base_model";
import { relationship_types } from "./relationship_types";

export interface FamilyNotRegisteredAttributes {
    registered_user_id: number;
    unregistered_email: string;
    registered_user_relationship_type: relationship_types;
    unregistered_user_relationship_type: relationship_types;
}

const EmptyNotRegisteredAttributes = (): FamilyNotRegisteredAttributes => ({
    registered_user_id: -1,
    unregistered_email: "",
    registered_user_relationship_type: relationship_types.Child,
    unregistered_user_relationship_type: relationship_types.Parent,
});

const NotRegisteredBuilder = <T extends Partial<FamilyNotRegisteredAttributes>>(
    options?: T
): FamilyNotRegisteredAttributes & T =>
    Object.assign(EmptyNotRegisteredAttributes(), options);

@Entity({ name: "family_not_registered" })
export default class FamilyNotRegistered
    extends BaseModel
    implements FamilyNotRegisteredAttributes
{
    @Column()
    public registered_user_id!: number;
    @Column()
    public unregistered_email!: string;
    @Column()
    public registered_user_relationship_type!: relationship_types;
    @Column()
    public unregistered_user_relationship_type!: relationship_types;

    public constructor(options?: Partial<FamilyNotRegisteredAttributes>) {
        super();
        const userAttr = NotRegisteredBuilder(options);
        Object.assign(this, userAttr);
    }
}
