import type { Access, FieldAccess } from 'payload';

export const userOnly: Access = ({ req }) => !!req.user;

export const userOnlyField: FieldAccess = ({ req }) => !!req.user;
