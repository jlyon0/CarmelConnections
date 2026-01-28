"use client";
import { useState } from "react";
import type { Employee, Team } from "@/types";
import TeamManager from "@/components/TeamManager";
import TeamViewer from "@/components/TeamViewer";
import DropdownParent from "@/components/DropDown";
import SpinningWheel from "@/components/SpinningWheel";
import SmoothWheelTest from "@/components/SmoothWheelTest";

export default function Page() {
  const [teams, setTeams] = useState<Team[]>([
    {
        "id": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "name": "Treasury Solutions"
    },
    {
        "id": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "name": "Capital Markets Solutions"
    },
    {
        "id": "693e7a42-0300-470f-be0f-fe478a93f013",
        "name": "Technology"
    },
    {
        "id": "b4190570-7a17-4da5-8bbd-58512f7c2e08",
        "name": "Client Relations"
    }
]);
    // High ups who don't participate: Christa, Bruce, Michelle, Mike, Brad, Eric, Matt
    // Interviee's that have actually been selected: Ryan C, Mellanie R, Justin B, Taylor K,
  const [employees, setEmployees] = useState<Employee[]>([
    {
        "id": "0111d695-1bad-4350-adbb-bd99368b65f3",
        "name": "Christa Winans",
        "teamId": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "726dff84-e081-4dc6-93e0-104a6a466858",
        "name": "Kayla Becnel",
        "teamId": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "700c5fd6-292c-42fe-80c7-82e3dfb77f88",
        "name": "Mickala Winans",
        "teamId": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "e3d8153a-7ffc-4ea2-857b-c4f8c116b188",
        "name": "Phil Graves",
        "teamId": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "8dcf52b7-3ce7-47df-9767-60a12108feac",
        "name": "Bruce Bredickas",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "fc0a21ee-2089-4f0b-9dd8-bc149cb22ddf",
        "name": "Ian Macias",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "9b5e1867-9e2f-4f01-97ae-4dfdd771d346",
        "name": "Katie Wilson",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "7222d766-21cf-428e-9e07-3c2da3c28df4",
        "name": "Mellanie Roder",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "a20783d0-3ab1-4012-b130-cf323204157c",
        "name": "Michelle Soltys",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "ae7e541d-3ffe-4f91-8fd8-93307d173f3c",
        "name": "Mike Holtman",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "ec20ce10-5a31-4190-8ab3-094ba7009799",
        "name": "Rob Syck",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "91c54a34-a3d7-4d42-ba73-6e3d31199f3c",
        "name": "Taylor Killoren",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "abb64db1-dcff-4c5f-8e15-dc80387081c0",
        "name": "Wade Pulliam",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "d20621e3-e959-486c-be1c-04af420dbc3e",
        "name": "Brad Thurber",
        "teamId": "693e7a42-0300-470f-be0f-fe478a93f013",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "81caef12-1df1-4c6c-a91c-56ab91a81924",
        "name": "Chris Alexander",
        "teamId": "693e7a42-0300-470f-be0f-fe478a93f013",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "51ecad0f-21b4-4ea9-bf43-5e4629270d6c",
        "name": "Elle Lynn",
        "teamId": "693e7a42-0300-470f-be0f-fe478a93f013",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "44da3239-96db-476b-9e8e-7c186dfcb7e5",
        "name": "Joe Lyon",
        "teamId": "693e7a42-0300-470f-be0f-fe478a93f013",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "e36c8443-f331-4032-acc9-d1837ce71e19",
        "name": "Justin Brown",
        "teamId": "693e7a42-0300-470f-be0f-fe478a93f013",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "f72e1825-fb30-4ac2-b9fe-b201d145f668",
        "name": "Robert Greenwood",
        "teamId": "693e7a42-0300-470f-be0f-fe478a93f013",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "9515e70a-23ec-4cc3-b81b-adebe98388d2",
        "name": "Eric Johnson",
        "teamId": "b4190570-7a17-4da5-8bbd-58512f7c2e08",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "c71e391c-6e38-4b11-9424-30aefc8cf4a8",
        "name": "Matt Marietta",
        "teamId": "b4190570-7a17-4da5-8bbd-58512f7c2e08",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "2a82c0a9-0447-4f01-82f4-688ff48befc1",
        "name": "Ryan Christie",
        "teamId": "b4190570-7a17-4da5-8bbd-58512f7c2e08",
        "interviewer": false,
        "intervieweeUsed": true
    },
    {
        "id": "9fcd6695-e442-4d88-be66-1a79d7e0cc5a",
        "name": "Sara Williamson",
        "teamId": "b4190570-7a17-4da5-8bbd-58512f7c2e08",
        "interviewer": true,
        "intervieweeUsed": true
    },
    {
        "id": "31102833-10f8-4322-946f-36eba5786333",
        "name": "Scott Via",
        "teamId": "b4190570-7a17-4da5-8bbd-58512f7c2e08",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "50ef4a59-8d5a-4ddd-8443-da2cf01e5d01",
        "name": "Bryant Meng",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "7eb7cd86-9860-41dc-83df-215cdf663cf7",
        "name": "Katherine Johnson",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "385c0264-e9d9-46e9-9f64-19be71003a4a",
        "name": "Michelle Pugh",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewer": false,
        "intervieweeUsed": false
    },
    {
        "id": "62d5bfd1-4594-4e9a-9d47-bb94ae53b7c3",
        "name": "Jami Marr",
        "teamId": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "interviewer": false,
        "intervieweeUsed": false
    }
]);
  const [selection, setSelection] = useState<{ interviewer: Employee | null; interviewee: Employee | null }>({
    interviewer: employees.find((e) => e.interviewer) || employees[0],
    interviewee: null,

  });
  console.log("Teams:", teams)
  console.log("Employees:", employees)

  return (
    <main className="app">
        <div className="titleRow">
            <h1 className="title">Carmel Connections</h1>
        </div>
        <div className="grid">
            <DropdownParent title="Team Manager" childComponentProps={null}>
            <TeamManager
                teams={teams}
                setTeams={setTeams}
                employees={employees}
                setEmployees={setEmployees}
                setSelection={setSelection}
            />
            </DropdownParent>
        </div>
        <div className="viewerRow">
            <TeamViewer
            teams={teams}
            setTeams={setTeams}
            employees={employees}
            setEmployees={setEmployees}
            />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
            <h3>Interviewer: {selection.interviewer?.name}</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <SpinningWheel
            teams={teams}
            setEmployees={setEmployees}
            employees={employees}
            setSelection={setSelection}
            selection={selection}
            />
        </div>
        {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <SmoothWheelTest />
        </div> */}
    </main>
  );
}
