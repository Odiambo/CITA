import ParticipantDetail from '@/features/pages/ParticipantDetail';

export default function ParticipantDetailRoute({ params }) {
  return <ParticipantDetail id={params.id} />;
}
