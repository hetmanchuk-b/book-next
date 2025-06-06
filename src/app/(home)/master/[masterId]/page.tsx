interface MasterIdPageProps {
  params: {
    masterId: string;
  }
}

const MasterIdPage = async ({params}: MasterIdPageProps) => {
  const {masterId} = await params;

  return (
    <div>
      {masterId}
    </div>
  );
};

export default MasterIdPage;