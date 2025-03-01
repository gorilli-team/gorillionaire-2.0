import assert from "assert";
import { 
  TestHelpers,
  Moyaki_Approval
} from "generated";
const { MockDb, Moyaki } = TestHelpers;

describe("Moyaki contract Approval event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Moyaki contract Approval event
  const event = Moyaki.Approval.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Moyaki_Approval is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Moyaki.Approval.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualMoyakiApproval = mockDbUpdated.entities.Moyaki_Approval.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedMoyakiApproval: Moyaki_Approval = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      spender: event.params.spender,
      value: event.params.value,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualMoyakiApproval, expectedMoyakiApproval, "Actual MoyakiApproval should be the same as the expectedMoyakiApproval");
  });
});
