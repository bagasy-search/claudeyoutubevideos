import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

export const epicSchema = z.object({
  channelName: z.string(),
  avatarName: z.string(),
  accentColor: zColor(),
});
export type EpicVideoProps = z.infer<typeof epicSchema>;
