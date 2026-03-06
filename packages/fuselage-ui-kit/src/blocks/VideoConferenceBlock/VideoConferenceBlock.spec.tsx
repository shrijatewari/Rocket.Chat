import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';

import VideoConferenceBlock from './VideoConferenceBlock';
import * as mockUiContexts from '../../../__mocks__/ui-contexts';
import * as mockUiKitContext from '../../../__mocks__/UiKitContext';

jest.mock('@rocket.chat/ui-contexts', () => ({
	...jest.requireActual('@rocket.chat/ui-contexts'),
	useTranslation: () => (key: string) => key,
	useUserId: () => 'user-id',
	useGoToRoom: () => jest.fn(),
	useSetting: () => false,
	useUserPreference: () => false,
}));

jest.mock('../../hooks/useSurfaceType', () => ({
	useSurfaceType: () => 'message',
}));

jest.mock('../..', () => ({
	UiKitContext: {
		Provider: ({ children }: { children: ReactElement }) => children,
	},
}));

jest.mock('./hooks/useVideoConfDataStream', () => ({
	useVideoConfDataStream: jest.fn(),
}));

const { useVideoConfDataStream } = require('./hooks/useVideoConfDataStream');

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return ({ children }: { children: ReactElement }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('VideoConferenceBlock', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should show skeleton when loading', () => {
		useVideoConfDataStream.mockReturnValue({
			isPending: true,
			isError: false,
			data: undefined,
		});

		const block = {
			type: 'video_conf' as const,
			callId: 'call-123',
			appId: 'test-app',
			blockId: 'block-123',
		};

		render(<VideoConferenceBlock block={block} context={{} as any} surfaceRenderer={{} as any} />, {
			wrapper: createWrapper(),
		});

		expect(screen.queryByText('Failed_to_load_call_information')).not.toBeInTheDocument();
	});

	it('should show error message when data fetch fails', () => {
		useVideoConfDataStream.mockReturnValue({
			isPending: false,
			isError: true,
			data: undefined,
		});

		const block = {
			type: 'video_conf' as const,
			callId: 'call-123',
			appId: 'test-app',
			blockId: 'block-123',
		};

		render(<VideoConferenceBlock block={block} context={{} as any} surfaceRenderer={{} as any} />, {
			wrapper: createWrapper(),
		});

		expect(screen.getByText('Failed_to_load_call_information')).toBeInTheDocument();
	});
});
