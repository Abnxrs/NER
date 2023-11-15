/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Manufacturer, Prisma } from '@prisma/client';
import manufacturerQueryArgs from '../prisma-query-args/manufacturers.query-args';

export const manufacturerTransformer = (
  manufacturer: Prisma.ManufacturerGetPayload<typeof manufacturerQueryArgs>
): Manufacturer => {
  return {
    name: manufacturer.name,
    dateCreated: manufacturer.dateCreated,
    creatorId: manufacturer.creatorId
  };
};